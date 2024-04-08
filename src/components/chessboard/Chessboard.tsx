import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { useEffect, useRef, useState } from "react";
import Referee from "../../referee/referee";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
  enPassent?: boolean;
}
export enum PieceType {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
}
export enum TeamType {
  OPPONENT,
  OUR,
}

const initialBoardState: Piece[] = [];
for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
  const type = teamType === TeamType.OPPONENT ? "black" : "white";
  const y = teamType === TeamType.OPPONENT ? 7 : 0;
  initialBoardState.push(
    {
      image: `assets/images/${type}_rook.png`,
      x: 0,
      y,
      type: PieceType.ROOK,
      team: teamType,
    },
    {
      image: `assets/images/${type}_rook.png`,
      x: 7,
      y,
      type: PieceType.ROOK,
      team: teamType,
    },
    {
      image: `assets/images/${type}_knight.png`,
      x: 6,
      y,
      type: PieceType.KNIGHT,
      team: teamType,
    },
    {
      image: `assets/images/${type}_knight.png`,
      x: 1,
      y,
      type: PieceType.KNIGHT,
      team: teamType,
    },
    {
      image: `assets/images/${type}_bishop.png`,
      x: 5,
      y,
      type: PieceType.BISHOP,
      team: teamType,
    },
    {
      image: `assets/images/${type}_bishop.png`,
      x: 2,
      y,
      type: PieceType.BISHOP,
      team: teamType,
    },
    {
      image: `assets/images/${type}_queen.png`,
      x: 3,
      y,
      type: PieceType.QUEEN,
      team: teamType,
    },
    {
      image: `assets/images/${type}_king.png`,
      x: 4,
      y,
      type: PieceType.KING,
      team: teamType,
    }
  );
}

// pawn
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({
    image: "assets/images/black_pawn.png",
    x: i,
    y: 6,
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  });
}
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({
    image: "assets/images/white_pawn.png",
    x: i,
    y: 1,
    type: PieceType.PAWN,
    team: TeamType.OUR,
  });
}

function Chessboard() {
  const referee = new Referee();
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  function grabpiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      );
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      setActivePiece(element);
    }
  }

  function movepiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 15;
      const minY = chessboard.offsetTop - 15;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 65;
      const maxY = chessboard.offsetTop + chessboard.clientWidth - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function droppiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
      );

      const currentPiece = pieces.find((p) => p.x == gridX && p.y == gridY);
      const attackedPiece = pieces.find((p) => p.x == x && p.y == y);
      if (currentPiece) {
        const vaildMove = referee.isValidMove(
          gridX,
          gridY,
          x,
          y,
          currentPiece?.type,
          currentPiece?.team,
          pieces
        );

        const isEnpassentMove = referee.isEnpassentMove(
          gridX,
          gridY,
          x,
          y,
          currentPiece.type,
          currentPiece.team,
          pieces
        );
        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnpassentMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY) {
              piece.enPassent = false;
              piece.x = x;
              piece.y = y;
              results.push(piece);
            } else if (!(piece.x === x && piece.y === y - pawnDirection)) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassent = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);
        } else if (vaildMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY) {
              if (Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN) {
                piece.enPassent = true;
              } else {
                piece.enPassent = false;
              }
              piece.x = x;
              piece.y = y;
              results.push(piece);
            } else if (!(piece.x === x && piece.y === y)) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassent = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }

      setActivePiece(null);
    }
  }

  let board = [];
  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < horizontalAxis.length; j++) {
      const number = i + j + 2;
      let image = undefined;
      pieces.forEach((p) => {
        if (p.x === j && p.y === i) {
          image = p.image;
        }
      });

      board.push(<Tile key={`${i},${j}`} image={image} number={number} />);
    }
  }
  return (
    <div
      onMouseMove={(e) => movepiece(e)}
      onMouseDown={(e) => grabpiece(e)}
      onMouseUp={(e) => droppiece(e)}
      className="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}

export default Chessboard;
