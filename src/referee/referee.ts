import { PieceType, TeamType, Piece, Position, samePosition } from "../Constants";

export default class Referee {
  tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType) {
    return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team);
  }

  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position) && p.team != team);
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  isEnpassentMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassent
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;
      //movement logic
      if (
        initialPosition.x === desiredPosition.x &&
        initialPosition.y === specialRow &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
      ) {
        if (
          !this.tileIsOccupied(desiredPosition, boardState) &&
          !this.tileIsOccupied({ x: desiredPosition.x, y: desiredPosition.y - pawnDirection }, boardState)
        ) {
          return true;
        }
      } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition, boardState)) {
          return true;
        }
      }
      //attack logic
      else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      } else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      }
    } else if (type === PieceType.KNIGHT) {
      //moving logic
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j <= 2; j += 2) {
          // top/bottom movement
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                return true;
              }
            }
          }
          // left/right movement
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                return true;
              }
            }
          }
        }
      }
    } else if (type == PieceType.BISHOP) {
      //movement logic
      for (let i = 1; i < 8; i++) {
        //upper right
        if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y + i,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
        }
        //upper left
        if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y + i,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
        }
        //bottom left
        if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y - i,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
        }
        //bottom right
        if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y - i,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
        }
      }
    }
    if (type === PieceType.ROOK) {
      //movement

      //horizontal
      if (initialPosition.y === desiredPosition.y) {
        for (let i = 1; i < 8; i++) {
          let multiplier = desiredPosition.x < initialPosition.x ? -1 : 1;
          let passedPosition: Position = {
            x: initialPosition.x + i * multiplier,
            y: initialPosition.y,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            console.log("arrived");
            break;
          }
          // return true;
        }
      }
      //vertical
      if (initialPosition.x === desiredPosition.x) {
        for (let i = 1; i < 8; i++) {
          let multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;
          let passedPosition: Position = {
            x: initialPosition.x,
            y: initialPosition.y + i * multiplier,
          };
          if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
            console.log("arrived");
            break;
          }
          // return true;
        }
      }
    }
    return false;
  }
}
