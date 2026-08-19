import Position from "./Position";

export default class Move {
  constructor(
    piece,
    from,
    to,
    capturedPiece = null,
    isCastling = false,
    rook = null,
    rookFrom = null,
    rookTo = null,
    isEnPassant = false,
    previousEnPassantTarget = null
  ) {
    if (!(from instanceof Position) || !(to instanceof Position)) {
      throw new Error("Move positions must be Position objects.");
    }

    this.piece = piece;
    this.from = from;
    this.to = to;
    this.capturedPiece = capturedPiece;

    this.previousHasMoved = piece.hasMoved;

    this.isCastling = isCastling;
    this.rook = rook;
    this.rookFrom = rookFrom;
    this.rookTo = rookTo;
    this.previousRookHasMoved = rook ? rook.hasMoved : null;
    this.isEnPassant = isEnPassant;
    this.previousEnPassantTarget =previousEnPassantTarget;
  }
}