import Position from "./Position";
import { COLORS, PIECE_TYPES } from "./constants";

export default class Piece {
  constructor(type, color, position) {
    if (!(position instanceof Position)) {
      throw new Error("Position must be a Position object.");
    }

    if (!Object.values(COLORS).includes(color)) {
      throw new Error("Invalid piece color.");
    }

    if (!Object.values(PIECE_TYPES).includes(type)) {
      throw new Error("Invalid piece type.");
    }

    this.type = type;
    this.color = color;
    this.position = position;
    this.hasMoved = false;
  }

  moveTo(newPosition) {
    if (!(newPosition instanceof Position)) {
      throw new Error("Position must be a Position object.");
    }

    this.position = newPosition;
    this.hasMoved = true;
  }

  getPseudoLegalMoves(board) {
    throw new Error(
      "getPseudoLegalMoves() must be implemented by the derived piece class."
    );
  }
}