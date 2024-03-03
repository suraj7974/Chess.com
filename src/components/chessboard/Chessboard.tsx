import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { useEffect, useRef, useState } from "react";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
  image: string;
  x: number;
  y: number;
}

const initialBoardState: Piece[] = [];
for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "nigga" : "white";
  const y = p === 0 ? 7 : 0;
  initialBoardState.push({ image: `assets/images/${type}_rook.png`, x: 0, y });
  initialBoardState.push({ image: `assets/images/${type}_rook.png`, x: 7, y });
  initialBoardState.push({
    image: `assets/images/${type}_knight.png`,
    x: 6,
    y,
  });
  initialBoardState.push({
    image: `assets/images/${type}_knight.png`,
    x: 1,
    y,
  });
  initialBoardState.push({
    image: `assets/images/${type}_bishop.png`,
    x: 5,
    y,
  });
  initialBoardState.push({
    image: `assets/images/${type}_bishop.png`,
    x: 2,
    y,
  });
  initialBoardState.push({ image: `assets/images/${type}_queen.png`, x: 3, y });
  initialBoardState.push({ image: `assets/images/${type}_king.png`, x: 4, y });
}

// pawn
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({ image: "assets/images/nigga_pawn.png", x: i, y: 6 });
}
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({ image: "assets/images/white_pawn.png", x: i, y: 1 });
}

function Chessboard() {
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
      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            p.x = x;
            p.y = y;
          }
          return p;
        });
        return pieces;
      });
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
