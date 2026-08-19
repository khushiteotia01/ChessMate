import Piece from "../Piece";
import { PIECE_TYPES } from "../constants.js";
import { rayCast } from "../moveUtils";

export default class Rook extends Piece {
  constructor(color, position) {
    super(PIECE_TYPES.ROOK, color, position);
  }

  getPseudoLegalMoves(board) {
   const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    return rayCast(board, this.position, directions, this.color);

  }
}