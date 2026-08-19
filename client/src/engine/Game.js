import Board from "./Board";
import Move from "./Move";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";
import Bishop from "./pieces/Bishop";
import Knight from "./pieces/Knight";
import Position from "./Position";
import { COLORS, PIECE_TYPES } from "./constants";

export default class Game {
  constructor() {
    this.board = new Board();
    this.currentPlayer = "white";
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.enPassantTarget = null;
  }

  switchTurn() {
    this.currentPlayer =
      this.currentPlayer === "white" ? "black" : "white";
  }
makeMove(from, to) {
  const piece = this.board.getPiece(from);

  if (!piece) {
    throw new Error("No piece at the starting position.");
  }

  if (piece.color !== this.currentPlayer) {
    throw new Error("It is not this player's turn.");
  }

  let isCastling = false;
  let rook = null;
  let rookFrom = null;
  let rookTo = null;

  // Check for castling
  if (
    piece.type === PIECE_TYPES.KING &&
    Math.abs(to.col - from.col) === 2
  ) {
    isCastling = true;

    const row = from.row;

    if (to.col > from.col) {
      // King-side
      rookFrom = new Position(row, 7);
      rookTo = new Position(row, 5);
    } else {
      // Queen-side
      rookFrom = new Position(row, 0);
      rookTo = new Position(row, 3);
    }

    rook = this.board.getPiece(rookFrom);

    if (!rook || rook.type !== PIECE_TYPES.ROOK) {
      throw new Error("Invalid castling move.");
    }
  }

  // Check for en passant
  let isEnPassant = false;
  let enPassantCapturedPiece = null;

  if (
    piece.type === PIECE_TYPES.PAWN &&
    this.enPassantTarget &&
    to.equals(this.enPassantTarget) &&
    !this.board.getPiece(to)
  ) {
    const capturedPawnPosition = new Position(
      from.row,
      to.col
    );

    const possiblePawn =
      this.board.getPiece(capturedPawnPosition);

    if (
      possiblePawn &&
      possiblePawn.type === PIECE_TYPES.PAWN &&
      possiblePawn.color !== piece.color
    ) {
      isEnPassant = true;
      enPassantCapturedPiece = possiblePawn;
    }
  }

  // Record what was captured
  const capturedPiece = isEnPassant
    ? enPassantCapturedPiece
    : this.board.getPiece(to);

  const move = new Move(
    piece,
    from,
    to,
    capturedPiece,
    isCastling,
    rook,
    rookFrom,
    rookTo,
    isEnPassant,
    this.enPassantTarget
  );

  // The old en passant opportunity expires
  this.enPassantTarget = null;

  // Make the main move
  this.board.movePiece(from, to);

  // Remove the pawn captured through en passant
  if (isEnPassant) {
    this.board.removePiece(
      new Position(from.row, to.col)
    );
  }

  // Move the rook during castling
  if (isCastling) {
    this.board.movePiece(rookFrom, rookTo);
  }

  // Create a new en passant target if a pawn moved two squares
  if (
    piece.type === PIECE_TYPES.PAWN &&
    Math.abs(to.row - from.row) === 2
  ) {
    this.enPassantTarget = new Position(
      (from.row + to.row) / 2,
      from.col
    );
  }

  this.moveHistory.push(move);

  this.switchTurn();

  return move;
}

  undoMove() {
  if (this.moveHistory.length === 0) {
    throw new Error("No moves to undo.");
  }

  const move = this.moveHistory.pop();

  // Remove the moved piece from its destination
  this.board.removePiece(move.to);

  // Move it back to its original square
  move.piece.moveTo(move.from);
  move.piece.hasMoved = move.previousHasMoved;

  this.board.setPiece(move.from, move.piece);

  // Restore a normally captured piece
  if (move.capturedPiece && !move.isEnPassant) {
    this.board.setPiece(move.to, move.capturedPiece);
  }

  // Restore the pawn captured through en passant
  if (move.isEnPassant) {
    const capturedPawnPosition = new Position(
      move.from.row,
      move.to.col
    );

    this.board.setPiece(
      capturedPawnPosition,
      move.capturedPiece
    );
  }

  // Restore the rook if this was castling
  if (move.isCastling) {
    this.board.removePiece(move.rookTo);

    move.rook.moveTo(move.rookFrom);
    move.rook.hasMoved = move.previousRookHasMoved;

    this.board.setPiece(move.rookFrom, move.rook);
  }

  // Restore the previous en-passant state
  this.enPassantTarget = move.previousEnPassantTarget;

  // Restore the previous player's turn
  this.switchTurn();

  return move;
}

isSquareAttacked(position, byColor) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = this.board.grid[row][col];

      if (!piece || piece.color !== byColor) {
        continue;
      }

      // Pawns attack diagonally, not forward.
      if (piece.type === "pawn") {
        const direction = piece.color === "white" ? -1 : 1;

        const rowDifference = position.row - piece.position.row;
        const colDifference = Math.abs(
          position.col - piece.position.col
        );

        if (
          rowDifference === direction &&
          colDifference === 1
        ) {
          return true;
        }

        continue;
      }

      const moves = piece.getPseudoLegalMoves(this.board);

      if (
        moves.some((move) => move.equals(position))
      ) {
        return true;
      }
    }
  }

  return false;
}
isInCheck(color) {
  let kingPosition = null;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = this.board.grid[row][col];

      if (
        piece &&
        piece.color === color &&
        piece.type === "king"
      ) {
        kingPosition = piece.position;
        break;
      }
    }

    if (kingPosition) {
      break;
    }
  }

  if (!kingPosition) {
    throw new Error("King not found on the board.");
  }

  const opponentColor =
    color === "white" ? "black" : "white";

  return this.isSquareAttacked(
    kingPosition,
    opponentColor
  );
}
getLegalMoves(piece) {
  if (piece.color !== this.currentPlayer) {
    return [];
  }

  let pseudoLegalMoves;

if (piece.type === PIECE_TYPES.PAWN) {
  pseudoLegalMoves = piece.getPseudoLegalMoves(
    this.board,
    this.enPassantTarget
  );
} else {
  pseudoLegalMoves = piece.getPseudoLegalMoves(this.board);
} 
  if (piece.type === PIECE_TYPES.KING) {
  pseudoLegalMoves = [
    ...pseudoLegalMoves,
    ...this.getCastlingMoves(piece.color),
  ];
}
 const legalMoves = [];
  for (const destination of pseudoLegalMoves) {
    const move = this.makeMove(
      piece.position,
      destination
    );

    const stillInCheck = this.isInCheck(piece.color);

    this.undoMove();

    if (!stillInCheck) {
      legalMoves.push(destination);
    }
  }

  return legalMoves;
}
promotePawn(position, pieceType) {
  const pawn = this.board.getPiece(position);

  if (!pawn || pawn.type !== "pawn") {
    throw new Error("There is no pawn at this position.");
  }

  const lastRow = pawn.color === "white" ? 0 : 7;

  if (position.row !== lastRow) {
    throw new Error("Pawn has not reached the promotion rank.");
  }

  let promotedPiece;

  switch (pieceType) {
    case "queen":
      promotedPiece = new Queen(pawn.color, position);
      break;

    case "rook":
      promotedPiece = new Rook(pawn.color, position);
      break;

    case "bishop":
      promotedPiece = new Bishop(pawn.color, position);
      break;

    case "knight":
      promotedPiece = new Knight(pawn.color, position);
      break;

    default:
      throw new Error("Invalid promotion piece.");
  }

  promotedPiece.hasMoved = true;

  this.board.setPiece(position, promotedPiece);

  return promotedPiece;
}
getCastlingMoves(color) {
  const row = color === COLORS.WHITE ? 7 : 0;

  const kingPosition = new Position(row, 4);
  const king = this.board.getPiece(kingPosition);

  if (
    !king ||
    king.type !== PIECE_TYPES.KING ||
    king.color !== color ||
    king.hasMoved
  ) {
    return [];
  }

  const opponentColor =
    color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

  if (this.isSquareAttacked(kingPosition, opponentColor)) {
    return [];
  }

  const moves = [];

  // King-side castling
  const kingSideRookPosition = new Position(row, 7);
  const kingSideRook = this.board.getPiece(kingSideRookPosition);

  if (
    kingSideRook &&
    kingSideRook.type === PIECE_TYPES.ROOK &&
    kingSideRook.color === color &&
    !kingSideRook.hasMoved &&
    this.board.isEmpty(new Position(row, 5)) &&
    this.board.isEmpty(new Position(row, 6)) &&
    !this.isSquareAttacked(
      new Position(row, 5),
      opponentColor
    ) &&
    !this.isSquareAttacked(
      new Position(row, 6),
      opponentColor
    )
  ) {
    moves.push(new Position(row, 6));
  }

  // Queen-side castling
  const queenSideRookPosition = new Position(row, 0);
  const queenSideRook = this.board.getPiece(queenSideRookPosition);

  if (
    queenSideRook &&
    queenSideRook.type === PIECE_TYPES.ROOK &&
    queenSideRook.color === color &&
    !queenSideRook.hasMoved &&
    this.board.isEmpty(new Position(row, 1)) &&
    this.board.isEmpty(new Position(row, 2)) &&
    this.board.isEmpty(new Position(row, 3)) &&
    !this.isSquareAttacked(
      new Position(row, 3),
      opponentColor
    ) &&
    !this.isSquareAttacked(
      new Position(row, 2),
      opponentColor
    )
  ) {
    moves.push(new Position(row, 2));
  }

  return moves;
}



  endGame(winner) {
    this.gameOver = true;
    this.winner = winner;
  }

  reset() {
    this.board = new Board();
    this.currentPlayer = "white";
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
  }
}