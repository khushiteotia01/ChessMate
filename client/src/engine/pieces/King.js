import Piece from "../Piece";
import { PIECE_TYPES } from "../constants";
import Position from "../Position";

export default class King extends Piece {
  constructor(color, position) {
    super(PIECE_TYPES.KING, color, position);
  }

  getPseudoLegalMoves(board) {
    const moves = [];

    const offsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
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