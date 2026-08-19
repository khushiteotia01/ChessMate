import Position from "./Position.js";

export default class Board {
  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  }

  getPiece(position) {
    if (!(position instanceof Position) || !position.isValid()) {
      throw new Error("Invalid position.");
    }

    return this.grid[position.row][position.col];
  }

  setPiece(position, piece) {
    if (!(position instanceof Position) || !position.isValid()) {
      throw new Error("Invalid position.");
    }

    this.grid[position.row][position.col] = piece;
  }

  removePiece(position) {
    if (!(position instanceof Position) || !position.isValid()) {
      throw new Error("Invalid position.");
    }

    this.grid[position.row][position.col] = null;
  }

  isEmpty(position) {
    return this.getPiece(position) === null;
  }

  movePiece(from, to) {
    const piece = this.getPiece(from);

    if (!piece) {
      throw new Error("No piece at the starting position.");
    }

    this.removePiece(from);
    piece.moveTo(to);
    this.setPiece(to, piece);
  }
}