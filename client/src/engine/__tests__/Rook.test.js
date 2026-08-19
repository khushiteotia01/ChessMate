import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import Rook from "../pieces/Rook";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Rook", () => {
  it("generates horizontal and vertical moves from the center", () => {
    const board = new Board();
    const rook = new Rook(COLORS.WHITE, new Position(4, 4));

    board.setPiece(rook.position, rook);

    const moves = rook.getPseudoLegalMoves(board);

    expect(moves).toHaveLength(14);
  });

  it("stops at a friendly piece", () => {
    const board = new Board();

    const rook = new Rook(COLORS.WHITE, new Position(4, 4));
    const friendlyPiece = new Knight(COLORS.WHITE, new Position(4, 6));

    board.setPiece(rook.position, rook);
    board.setPiece(friendlyPiece.position, friendlyPiece);

    const moves = rook.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(friendlyPiece.position))
    ).toBe(false);

    expect(
      moves.some((position) => position.equals(new Position(4, 7)))
    ).toBe(false);
  });

  it("can capture an enemy piece but cannot move beyond it", () => {
    const board = new Board();

    const rook = new Rook(COLORS.WHITE, new Position(4, 4));
    const enemyPiece = new Knight(COLORS.BLACK, new Position(4, 6));

    board.setPiece(rook.position, rook);
    board.setPiece(enemyPiece.position, enemyPiece);

    const moves = rook.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyPiece.position))
    ).toBe(true);

    expect(
      moves.some((position) => position.equals(new Position(4, 7)))
    ).toBe(false);
  });
});