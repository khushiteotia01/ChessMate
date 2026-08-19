import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import King from "../pieces/King";
import Rook from "../pieces/Rook";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Legal move filtering", () => {
  it("rejects a move that exposes the king to check", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(7, 4)
    );

    const whiteRook = new Rook(
      COLORS.WHITE,
      new Position(6, 4)
    );

    const blackRook = new Rook(
      COLORS.BLACK,
      new Position(0, 4)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(whiteRook.position, whiteRook);
    game.board.setPiece(blackRook.position, blackRook);

    const legalMoves = game.getLegalMoves(whiteRook);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(6, 5))
      )
    ).toBe(false);
  });

  it("allows a move that does not expose the king", () => {
    const game = new Game();

    const whiteKing = new King(
      COLORS.WHITE,
      new Position(7, 4)
    );

    const whiteKnight = new Knight(
      COLORS.WHITE,
      new Position(5, 2)
    );

    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(whiteKnight.position, whiteKnight);

    const legalMoves = game.getLegalMoves(whiteKnight);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(3, 3))
      )
    ).toBe(true);
  });
});