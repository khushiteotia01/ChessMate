import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import Pawn from "../pieces/Pawn";
import Queen from "../pieces/Queen";
import Rook from "../pieces/Rook";
import Bishop from "../pieces/Bishop";
import Knight from "../pieces/Knight";
import { COLORS, PIECE_TYPES } from "../constants";

describe("Pawn promotion", () => {
  it("promotes a white pawn to a queen", () => {
    const game = new Game();

    const position = new Position(0, 4);
    const pawn = new Pawn(COLORS.WHITE, position);

    game.board.setPiece(position, pawn);

    const promotedPiece = game.promotePawn(
      position,
      PIECE_TYPES.QUEEN
    );

    expect(promotedPiece).toBeInstanceOf(Queen);
    expect(game.board.getPiece(position)).toBe(promotedPiece);
  });

  it("can promote to a rook", () => {
    const game = new Game();

    const position = new Position(0, 4);
    const pawn = new Pawn(COLORS.WHITE, position);

    game.board.setPiece(position, pawn);

    const promotedPiece = game.promotePawn(
      position,
      PIECE_TYPES.ROOK
    );

    expect(promotedPiece).toBeInstanceOf(Rook);
  });

  it("can promote to a bishop", () => {
    const game = new Game();

    const position = new Position(0, 4);
    const pawn = new Pawn(COLORS.WHITE, position);

    game.board.setPiece(position, pawn);

    const promotedPiece = game.promotePawn(
      position,
      PIECE_TYPES.BISHOP
    );

    expect(promotedPiece).toBeInstanceOf(Bishop);
  });

  it("can promote to a knight", () => {
    const game = new Game();

    const position = new Position(0, 4);
    const pawn = new Pawn(COLORS.WHITE, position);

    game.board.setPiece(position, pawn);

    const promotedPiece = game.promotePawn(
      position,
      PIECE_TYPES.KNIGHT
    );

    expect(promotedPiece).toBeInstanceOf(Knight);
  });

  it("rejects promotion before reaching the final rank", () => {
    const game = new Game();

    const position = new Position(3, 4);
    const pawn = new Pawn(COLORS.WHITE, position);

    game.board.setPiece(position, pawn);

    expect(() => {
      game.promotePawn(position, PIECE_TYPES.QUEEN);
    }).toThrow("Pawn has not reached the promotion rank.");
  });
});