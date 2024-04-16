import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { useEffect, useRef, useState } from "react";
import Referee from "../../referee/referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  Piece,
  PieceType,
  TeamType,
  initialBoardState,
  Position,
  GRID_SIZE,
  samePosition,
} from "../../Constants";

function Chessboard() {
  const referee = new Referee();
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  function grabpiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({
        x: grabX,
        y: grabY,
      });
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
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
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );
      if (currentPiece) {
        const vaildMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece?.type,
          currentPiece?.team,
          pieces
        );

        const isEnpassentMove = referee.isEnpassentMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );
        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnpassentMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassent = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
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
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassent =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
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
  for (let i = VERTICAL_AXIS.length - 1; i >= 0; i--) {
    for (let j = 0; j < HORIZONTAL_AXIS.length; j++) {
      const number = i + j + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: j, y: i })
      );
      let image = piece ? piece.image : undefined;

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
