import "./Tile.css";

interface Props {
  number: number;
  image?: string;
}

function Tile({ number, image }: Props) {
  if (number % 2 === 0) {
    return <div className="tile nigga-tile"><img src={image} alt="" /></div>;
  } else {
    return <div className="tile white-tile"><img src={image} alt="" /></div>;
  }
}

export default Tile;
