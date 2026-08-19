import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import King from "../pieces/King";
import Rook from "../pieces/Rook";
import Knight from "../pieces/Knight";
import Pawn from "../pieces/Pawn";
import { COLORS } from "../constants";

describe("Check detection", () => {
  it("detects a rook attacking a king", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackRook = new Rook(
      COLORS.BLACK,
      new Position(4, 0)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(blackRook.position, blackRook);

    expect(game.isInCheck(COLORS.WHITE)).toBe(true);
  });

  it("returns false when the king is not attacked", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackRook = new Rook(
      COLORS.BLACK,
      new Position(0, 0)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(blackRook.position, blackRook);

    expect(game.isInCheck(COLORS.WHITE)).toBe(false);
  });

  it("detects a knight attacking a king", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackKnight = new Knight(
      COLORS.BLACK,
      new Position(2, 3)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(
      blackKnight.position,
      blackKnight
    );

    expect(game.isInCheck(COLORS.WHITE)).toBe(true);
  });

  it("detects a pawn attacking a king diagonally", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(3, 3)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(
      blackPawn.position,
      blackPawn
    );

    expect(game.isInCheck(COLORS.WHITE)).toBe(true);
  });
});