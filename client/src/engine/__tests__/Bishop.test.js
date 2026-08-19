import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import Bishop from "../pieces/Bishop";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Bishop", () => {
  it("generates diagonal moves from the center", () => {
    const board = new Board();
    const bishop = new Bishop(COLORS.WHITE, new Position(4, 4));

    board.setPiece(bishop.position, bishop);

    const moves = bishop.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(13);
  });

  it("stops at a friendly piece", () => {
    const board = new Board();

    const bishop = new Bishop(COLORS.WHITE, new Position(4, 4));
    const friendlyPiece = new Knight(COLORS.WHITE, new Position(2, 2));

    board.setPiece(bishop.position, bishop);
    board.setPiece(friendlyPiece.position, friendlyPiece);

    const moves = bishop.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(friendlyPiece.position))
    ).toBe(false);

    expect(
      moves.some((position) => position.equals(new Position(1, 1)))
    ).toBe(false);
  });

  it("can capture an enemy piece but cannot move beyond it", () => {
    const board = new Board();

    const bishop = new Bishop(COLORS.WHITE, new Position(4, 4));
    const enemyPiece = new Knight(COLORS.BLACK, new Position(2, 2));

    board.setPiece(bishop.position, bishop);
    board.setPiece(enemyPiece.position, enemyPiece);

    const moves = bishop.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyPiece.position))
    ).toBe(true);

    expect(
      moves.some((position) => position.equals(new Position(1, 1)))
    ).toBe(false);
  });
});