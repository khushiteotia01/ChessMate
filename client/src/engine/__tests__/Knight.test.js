import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Knight", () => {
  it("generates all 8 moves from the center of the board", () => {
    const board = new Board();
    const knight = new Knight(COLORS.WHITE, new Position(4, 4));

    board.setPiece(knight.position, knight);

    const moves = knight.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(8);
  });

  it("does not generate moves outside the board", () => {
    const board = new Board();
    const knight = new Knight(COLORS.WHITE, new Position(0, 0));

    board.setPiece(knight.position, knight);

    const moves = knight.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(2);
  });

  it("cannot land on a square occupied by its own piece", () => {
    const board = new Board();

    const knight = new Knight(COLORS.WHITE, new Position(4, 4));
    const friendlyKnight = new Knight(COLORS.WHITE, new Position(2, 3));

    board.setPiece(knight.position, knight);
    board.setPiece(friendlyKnight.position, friendlyKnight);

    const moves = knight.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(friendlyKnight.position))
    ).toBe(false);
  });

  it("can capture an enemy piece", () => {
    const board = new Board();

    const knight = new Knight(COLORS.WHITE, new Position(4, 4));
    const enemyKnight = new Knight(COLORS.BLACK, new Position(2, 3));

    board.setPiece(knight.position, knight);
    board.setPiece(enemyKnight.position, enemyKnight);

    const moves = knight.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyKnight.position))
    ).toBe(true);
  });
});