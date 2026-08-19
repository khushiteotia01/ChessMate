import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import Queen from "../pieces/Queen";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Queen", () => {
  it("generates straight and diagonal moves from the center", () => {
    const board = new Board();
    const queen = new Queen(COLORS.WHITE, new Position(4, 4));

    board.setPiece(queen.position, queen);

    const moves = queen.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(27);
  });

  it("cannot move through a friendly piece", () => {
    const board = new Board();

    const queen = new Queen(COLORS.WHITE, new Position(4, 4));
    const friendlyPiece = new Knight(COLORS.WHITE, new Position(4, 6));

    board.setPiece(queen.position, queen);
    board.setPiece(friendlyPiece.position, friendlyPiece);

    const moves = queen.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(new Position(4, 7)))
    ).toBe(false);
  });

  it("can capture an enemy piece", () => {
    const board = new Board();

    const queen = new Queen(COLORS.WHITE, new Position(4, 4));
    const enemyPiece = new Knight(COLORS.BLACK, new Position(4, 6));

    board.setPiece(queen.position, queen);
    board.setPiece(enemyPiece.position, enemyPiece);

    const moves = queen.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyPiece.position))
    ).toBe(true);
  });
});