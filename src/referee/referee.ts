import { config } from "process";
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
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = this.pawnMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KNIGHT:
        validMove = this.knightMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMove = this.bishopMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.ROOK:
        validMove = this.rookMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.QUEEN:
        validMove = this.queenMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KING:
        validMove = this.kingMove(initialPosition, desiredPosition, team, boardState);
        break;
    }
    return validMove;
  }

  //pawn
  pawnMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
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
    return false;
  }
  //knight
  knightMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
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
    return false;
  }
  //bishop
  bishopMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
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
    return false;
  }
  //rook
  rookMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
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
    //vertical
    if (initialPosition.x === desiredPosition.x) {
      for (let i = 1; i < 8; i++) {
        let multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;
        let passedPosition: Position = {
          x: initialPosition.x,
          y: initialPosition.y + i * multiplier,
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
    return false;
  }
  queenMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
    return false;
  }
  kingMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
    if (desiredPosition.x - initialPosition.x == 1 && desiredPosition.y === initialPosition.y) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.x - initialPosition.x == -1 && desiredPosition.y === initialPosition.y) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.y - initialPosition.y == 1 && desiredPosition.x === initialPosition.x) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.y - initialPosition.y == -1 && desiredPosition.x === initialPosition.x) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.x - initialPosition.x == -1 && desiredPosition.y - initialPosition.y == 1) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.x - initialPosition.x == -1 && desiredPosition.y - initialPosition.y == -1) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.x - initialPosition.x == 1 && desiredPosition.y - initialPosition.y == 1) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    if (desiredPosition.x - initialPosition.x == 1 && desiredPosition.y - initialPosition.y == -1) {
      if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    return false;
  }
}
