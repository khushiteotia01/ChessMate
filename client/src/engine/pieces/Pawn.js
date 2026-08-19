import Piece from "../Piece";
import { COLORS, PIECE_TYPES } from "../constants";
import Position from "../Position";

export default class Pawn extends Piece {
  constructor(color, position) {
    super(PIECE_TYPES.PAWN, color, position);
  }

  getPseudoLegalMoves(board, enPassantTarget = null) {
    const moves = [];

    const direction = this.color === COLORS.WHITE ? -1 : 1;

    const oneStep = new Position(
      this.position.row + direction,
      this.position.col
    );

    // Move one square forward if it is empty.
    if (oneStep.isValid() && board.isEmpty(oneStep)) {
      moves.push(oneStep);

      // Move two squares forward only on the first move.
      if (!this.hasMoved) {
        const twoStep = new Position(
          this.position.row + 2 * direction,
          this.position.col
        );

        if (twoStep.isValid() && board.isEmpty(twoStep)) {
          moves.push(twoStep);
        }
      }
    }

    // Capture diagonally.
    const captureOffsets = [-1, 1];

    for (const colOffset of captureOffsets) {
      const capturePosition = new Position(
        this.position.row + direction,
        this.position.col + colOffset
      );

      if (!capturePosition.isValid()) {
        continue;
      }

      const targetPiece = board.getPiece(capturePosition);

      if (targetPiece && targetPiece.color !== this.color) {
        moves.push(capturePosition);
      }
      if (
  !targetPiece &&
  enPassantTarget &&
  capturePosition.equals(enPassantTarget)
) {
  moves.push(capturePosition);
}
    }

    return moves;
  }
}