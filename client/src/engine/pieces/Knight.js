import Piece from "../Piece";
import { PIECE_TYPES } from "../constants";
import Position from "../Position";

export default class Knight extends Piece {
  constructor(color, position) {
    super(PIECE_TYPES.KNIGHT, color, position);
  }

  getPseudoLegalMoves(board) {
    const moves = [];

    const offsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const [rowOffset, colOffset] of offsets) {
      const newRow = this.position.row + rowOffset;
      const newCol = this.position.col + colOffset;

      const newPosition = new Position(newRow, newCol);

      if (!newPosition.isValid()) {
        continue;
      }

      const targetPiece = board.getPiece(newPosition);

      if (!targetPiece || targetPiece.color !== this.color) {
        moves.push(newPosition);
      }
    }

    return moves;
  }
}