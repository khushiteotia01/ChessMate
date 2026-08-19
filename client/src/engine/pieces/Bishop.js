import Piece from "../Piece";
import { PIECE_TYPES } from "../constants";
import { rayCast } from "../moveUtils";

export default class Bishop extends Piece {
  constructor(color, position) {
    super(PIECE_TYPES.BISHOP, color, position);
  }

  getPseudoLegalMoves(board) {
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    return rayCast(board, this.position, directions, this.color);
  }
}