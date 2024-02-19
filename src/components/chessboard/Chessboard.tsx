import "./Chessboard.css";
import Tile from "../Tile/Tile";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

function Chessboard() {
  let board = [];
  for (let i = verticalAxis.length - 1; i >= 0; i--) {
    for (let j = 0; j < horizontalAxis.length; j++) {
      const number = i + j + 2;

      board.push( <Tile number = {number} /> )
    }
  }
  return <div className="chessboard">{board}</div>;
}

export default Chessboard;
