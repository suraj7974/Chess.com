import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { useRef } from "react";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
  image: string;
  x: number;
  y: number;
}

const pieces: Piece[] = [];
// pawn
for (let i = 0; i <= 7; i++) {
  pieces.push({ image: "assets/images/nigga_pawn.png", x: i, y: 6 });
}
for (let i = 0; i <= 7; i++) {
  pieces.push({ image: "assets/images/white_pawn.png", x: i, y: 1 });
}

// rook
pieces.push({ image: "assets/images/nigga_rook.png", x: 7, y: 7 });
pieces.push({ image: "assets/images/nigga_rook.png", x: 0, y: 7 });
pieces.push({ image: "assets/images/white_rook.png", x: 0, y: 0 });
pieces.push({ image: "assets/images/white_rook.png", x: 7, y: 0 });

// knight
pieces.push({ image: "assets/images/nigga_knight.png", x: 1, y: 7 });
pieces.push({ image: "assets/images/nigga_knight.png", x: 6, y: 7 });
pieces.push({ image: "assets/images/white_knight.png", x: 1, y: 0 });
pieces.push({ image: "assets/images/white_knight.png", x: 6, y: 0 });

//bishop
pieces.push({ image: "assets/images/nigga_bishop.png", x: 2, y: 7 });
pieces.push({ image: "assets/images/nigga_bishop.png", x: 5, y: 7 });
pieces.push({ image: "assets/images/white_bishop.png", x: 2, y: 0 });
pieces.push({ image: "assets/images/white_bishop.png", x: 5, y: 0 });

//queen
pieces.push({ image: "assets/images/nigga_queen.png", x: 3, y: 7 });
pieces.push({ image: "assets/images/white_queen.png", x: 3, y: 0 });

//king
pieces.push({ image: "assets/images/nigga_king.png", x: 4, y: 7 });
pieces.push({ image: "assets/images/white_king.png", x: 4, y: 0 });

function Chessboard() {
  const chessboardRef = useRef<HTMLDivElement>(null);

  let activePiece: HTMLElement | null = null;

  function grabpiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains("chess-piece")) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      activePiece = element;
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
        activePiece.style.top= `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function droppiece(e: React.MouseEvent) {
    if (activePiece) {
      activePiece = null;
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
