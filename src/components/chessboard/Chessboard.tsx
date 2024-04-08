import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { useEffect, useRef, useState } from "react";
import Referee from "../../referee/referee";
import {verticalAxis,horizontalAxis,Piece,PieceType,TeamType,initialBoardState} from "../../Constants";

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
