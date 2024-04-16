export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const GRID_SIZE = 100;
export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface Position {
  x: number;
  y: number;
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

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassent?: boolean;
}

export const initialBoardState: Piece[] = [];
for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
  const type = teamType === TeamType.OPPONENT ? "black" : "white";
  const y = teamType === TeamType.OPPONENT ? 7 : 0;
  initialBoardState.push(
    {
      image: `assets/images/${type}_rook.png`,
      position: {
        x: 0,
        y,
      },
      type: PieceType.ROOK,
      team: teamType,
    },
    {
      image: `assets/images/${type}_rook.png`,
      position: {
        x: 7,
        y,
      },
      type: PieceType.ROOK,
      team: teamType,
    },
    {
      image: `assets/images/${type}_knight.png`,
      position: {
        x: 6,
        y,
      },
      type: PieceType.KNIGHT,
      team: teamType,
    },
    {
      image: `assets/images/${type}_knight.png`,
      position: {
        x: 1,
        y,
      },
      type: PieceType.KNIGHT,
      team: teamType,
    },
    {
      image: `assets/images/${type}_bishop.png`,
      position: {
        x: 5,
        y,
      },
      type: PieceType.BISHOP,
      team: teamType,
    },
    {
      image: `assets/images/${type}_bishop.png`,
      position: {
        x: 2,
        y,
      },
      type: PieceType.BISHOP,
      team: teamType,
    },
    {
      image: `assets/images/${type}_queen.png`,
      position: {
        x: 3,
        y,
      },
      type: PieceType.QUEEN,
      team: teamType,
    },
    {
      image: `assets/images/${type}_king.png`,
      position: {
        x: 4,
        y,
      },
      type: PieceType.KING,
      team: teamType,
    }
  );
}

// pawn
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({
    image: "assets/images/black_pawn.png",
    position: {
      x: i,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  });
}
for (let i = 0; i <= 7; i++) {
  initialBoardState.push({
    image: "assets/images/white_pawn.png",
    position: {
      x: i,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  });
}
