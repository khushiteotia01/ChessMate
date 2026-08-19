import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import King from "../pieces/King";
import Rook from "../pieces/Rook";
import Knight from "../pieces/Knight";
import { COLORS, PIECE_TYPES } from "../constants";

describe("Castling", () => {
  it("allows king-side castling", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(true);
  });

  it("allows queen-side castling", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 0));

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 2))
      )
    ).toBe(true);
  });

  it("does not allow castling if the king has moved", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));

    king.hasMoved = true;

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(false);
  });

  it("does not allow castling if the rook has moved", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));

    rook.hasMoved = true;

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(false);
  });

  it("does not allow castling through a piece", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));
    const blocker = new Knight(COLORS.WHITE, new Position(7, 5));

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);
    game.board.setPiece(blocker.position, blocker);

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(false);
  });

  it("does not allow castling while the king is in check", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));
    const attackingRook = new Rook(
      COLORS.BLACK,
      new Position(5, 4)
    );

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);
    game.board.setPiece(
      attackingRook.position,
      attackingRook
    );

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(false);
  });

  it("does not allow castling through an attacked square", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));
    const attackingRook = new Rook(
      COLORS.BLACK,
      new Position(5, 5)
    );

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);
    game.board.setPiece(
      attackingRook.position,
      attackingRook
    );

    const legalMoves = game.getLegalMoves(king);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(7, 6))
      )
    ).toBe(false);
  });

  it("moves both king and rook when castling", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    game.makeMove(
      new Position(7, 4),
      new Position(7, 6)
    );

    expect(
      game.board.getPiece(new Position(7, 6))
    ).toBe(king);

    expect(
      game.board.getPiece(new Position(7, 5))
    ).toBe(rook);

    expect(
      game.board.getPiece(new Position(7, 4))
    ).toBeNull();

    expect(
      game.board.getPiece(new Position(7, 7))
    ).toBeNull();
  });

  it("undoes castling and restores both pieces", () => {
    const game = new Game();

    const king = new King(COLORS.WHITE, new Position(7, 4));
    const rook = new Rook(COLORS.WHITE, new Position(7, 7));

    game.board.setPiece(king.position, king);
    game.board.setPiece(rook.position, rook);

    game.makeMove(
      new Position(7, 4),
      new Position(7, 6)
    );

    game.undoMove();

    expect(
      game.board.getPiece(new Position(7, 4))
    ).toBe(king);

    expect(
      game.board.getPiece(new Position(7, 7))
    ).toBe(rook);

    expect(
      game.board.getPiece(new Position(7, 5))
    ).toBeNull();

    expect(
      game.board.getPiece(new Position(7, 6))
    ).toBeNull();
  });
});