import { describe, it, expect } from "vitest";
import Board from "../Board";
import Position from "../Position";
import Pawn from "../pieces/Pawn";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Pawn", () => {
  it("can move one or two squares forward on its first move", () => {
    const board = new Board();
    const pawn = new Pawn(COLORS.WHITE, new Position(6, 4));

    board.setPiece(pawn.position, pawn);

    const moves = pawn.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(new Position(5, 4)))
    ).toBe(true);

    expect(
      moves.some((position) => position.equals(new Position(4, 4)))
    ).toBe(true);
  });

  it("can only move one square forward after it has moved", () => {
    const board = new Board();
    const pawn = new Pawn(COLORS.WHITE, new Position(5, 4));

    pawn.hasMoved = true;
    board.setPiece(pawn.position, pawn);

    const moves = pawn.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(new Position(4, 4)))
    ).toBe(true);

    expect(
      moves.some((position) => position.equals(new Position(3, 4)))
    ).toBe(false);
  });

  it("cannot move forward if blocked", () => {
    const board = new Board();

    const pawn = new Pawn(COLORS.WHITE, new Position(6, 4));
    const blockingPiece = new Knight(COLORS.BLACK, new Position(5, 4));

    board.setPiece(pawn.position, pawn);
    board.setPiece(blockingPiece.position, blockingPiece);

    const moves = pawn.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(new Position(5, 4)))
    ).toBe(false);

    expect(
      moves.some((position) => position.equals(new Position(4, 4)))
    ).toBe(false);
  });

  it("can capture an enemy piece diagonally", () => {
    const board = new Board();

    const pawn = new Pawn(COLORS.WHITE, new Position(4, 4));
    const enemyPiece = new Knight(COLORS.BLACK, new Position(3, 5));

    board.setPiece(pawn.position, pawn);
    board.setPiece(enemyPiece.position, enemyPiece);

    const moves = pawn.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(enemyPiece.position))
    ).toBe(true);
  });

  it("cannot capture a friendly piece", () => {
    const board = new Board();

    const pawn = new Pawn(COLORS.WHITE, new Position(4, 4));
    const friendlyPiece = new Knight(COLORS.WHITE, new Position(3, 5));

    board.setPiece(pawn.position, pawn);
    board.setPiece(friendlyPiece.position, friendlyPiece);

    const moves = pawn.getPseudoLegalMoves(board);

    expect(
      moves.some((position) => position.equals(friendlyPiece.position))
    ).toBe(false);
  });
});