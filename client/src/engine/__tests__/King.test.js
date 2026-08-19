import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import King from "../pieces/King";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("King", () => {
  it("generates all 8 moves from the center", () => {
    const board = new Board();
    const king = new King(COLORS.WHITE, new Position(4, 4));

    board.setPiece(king.position, king);

    const moves = king.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(8);
  });

  it("does not generate moves outside the board", () => {
    const board = new Board();
    const king = new King(COLORS.WHITE, new Position(0, 0));

    board.setPiece(king.position, king);

    const moves = king.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(3);
  });

  it("cannot move onto a friendly piece", () => {
    const board = new Board();

    const king = new King(COLORS.WHITE, new Position(4, 4));
    const friendlyPiece = new Knight(COLORS.WHITE, new Position(3, 4));

    board.setPiece(king.position, king);
    board.setPiece(friendlyPiece.position, friendlyPiece);

    const moves = king.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(friendlyPiece.position))
    ).toBe(false);
  });

  it("can capture an enemy piece", () => {
    const board = new Board();

    const king = new King(COLORS.WHITE, new Position(4, 4));
    const enemyPiece = new Knight(COLORS.BLACK, new Position(3, 4));

    board.setPiece(king.position, king);
    board.setPiece(enemyPiece.position, enemyPiece);

    const moves = king.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyPiece.position))
    ).toBe(true);
  });
});