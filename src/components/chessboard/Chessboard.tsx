import "./Chessboard.css";
import Tile from "../Tile/Tile";

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

      board.push(<Tile image={image} number={number} />);
    }
  }
  return <div className="chessboard">{board}</div>;
}

export default Chessboard;
