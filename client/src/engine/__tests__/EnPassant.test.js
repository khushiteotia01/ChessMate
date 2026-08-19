import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import Pawn from "../pieces/Pawn";
import { COLORS } from "../constants";
import King from "../pieces/King";

describe("En passant", () => {
  it("allows en passant immediately after a two-square pawn move", () => {
    const game = new Game();
    const whiteKing = new King(
       COLORS.WHITE,
       new Position(7, 4)
    );

    const whitePawn = new Pawn(
      COLORS.WHITE,
      new Position(3, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(1, 3)
    );
    
    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(whitePawn.position, whitePawn);
    game.board.setPiece(blackPawn.position, blackPawn);

    // Black moves d7 -> d5
    game.currentPlayer = COLORS.BLACK;

    game.makeMove(
      new Position(1, 3),
      new Position(3, 3)
    );

    // White should be able to capture en passant: e5 -> d6
    const legalMoves = game.getLegalMoves(whitePawn);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(2, 3))
      )
    ).toBe(true);
  });

  it("captures the pawn through en passant", () => {
    const game = new Game();

    const whitePawn = new Pawn(
      COLORS.WHITE,
      new Position(3, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(1, 3)
    );

    game.board.setPiece(whitePawn.position, whitePawn);
    game.board.setPiece(blackPawn.position, blackPawn);

    game.currentPlayer = COLORS.BLACK;

    game.makeMove(
      new Position(1, 3),
      new Position(3, 3)
    );

    game.makeMove(
      new Position(3, 4),
      new Position(2, 3)
    );

    expect(
      game.board.getPiece(new Position(2, 3))
    ).toBe(whitePawn);

    expect(
      game.board.getPiece(new Position(3, 3))
    ).toBeNull();
  });

  it("does not allow en passant after another move", () => {
    const game = new Game();

    const whitePawn = new Pawn(
      COLORS.WHITE,
      new Position(3, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(1, 3)
    );

    const blackOtherPawn = new Pawn(
      COLORS.BLACK,
      new Position(1, 6)
    );

    game.board.setPiece(whitePawn.position, whitePawn);
    game.board.setPiece(blackPawn.position, blackPawn);
    game.board.setPiece(
      blackOtherPawn.position,
      blackOtherPawn
    );

    game.currentPlayer = COLORS.BLACK;

    // Black d7 -> d5
    game.makeMove(
      new Position(1, 3),
      new Position(3, 3)
    );

    // White makes another move instead
    game.makeMove(
      new Position(3, 4),
      new Position(2, 4)
    );

    // Black makes another move
    game.makeMove(
      new Position(1, 6),
      new Position(2, 6)
    );

    // White pawn is no longer in position to en passant anyway.
    // More importantly, the old target has expired.
    expect(game.enPassantTarget).toBeNull();
  });

  it("does not allow en passant when the pawn moved only one square", () => {
    const game = new Game();

    const whitePawn = new Pawn(
      COLORS.WHITE,
      new Position(3, 4)
    );

    const whiteKing = new King(
       COLORS.WHITE,
       new Position(7, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(2, 3)
    );
    
    game.board.setPiece(whiteKing.position, whiteKing);
    game.board.setPiece(whitePawn.position, whitePawn);
    game.board.setPiece(blackPawn.position, blackPawn);

    game.currentPlayer = COLORS.BLACK;

    // Only one square: d6 -> d5
    game.makeMove(
      new Position(2, 3),
      new Position(3, 3)
    );

    const legalMoves = game.getLegalMoves(whitePawn);

    expect(
      legalMoves.some((position) =>
        position.equals(new Position(2, 3))
      )
    ).toBe(false);

    expect(game.enPassantTarget).toBeNull();
  });

  it("undoes an en passant capture correctly", () => {
    const game = new Game();

    const whitePawn = new Pawn(
      COLORS.WHITE,
      new Position(3, 4)
    );

    const blackPawn = new Pawn(
      COLORS.BLACK,
      new Position(1, 3)
    );

    game.board.setPiece(whitePawn.position, whitePawn);
    game.board.setPiece(blackPawn.position, blackPawn);

    game.currentPlayer = COLORS.BLACK;

    // Black d7 -> d5
    game.makeMove(
      new Position(1, 3),
      new Position(3, 3)
    );

    // White e5 -> d6 en passant
    game.makeMove(
      new Position(3, 4),
      new Position(2, 3)
    );

    game.undoMove();

    expect(
      game.board.getPiece(new Position(3, 4))
    ).toBe(whitePawn);

    expect(
      game.board.getPiece(new Position(3, 3))
    ).toBe(blackPawn);

    expect(
      game.board.getPiece(new Position(2, 3))
    ).toBeNull();
  });
});