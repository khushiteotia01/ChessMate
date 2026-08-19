import { describe, it, expect } from "vitest";
import Game from "../Game";
import Position from "../Position";
import Knight from "../pieces/Knight";
import { COLORS } from "../constants";

describe("Game - undoMove", () => {
  it("undoes a normal move", () => {
    const game = new Game();

    const knight = new Knight(
      COLORS.WHITE,
      new Position(4, 4)
    );

    game.board.setPiece(knight.position, knight);

    game.makeMove(
      new Position(4, 4),
      new Position(2, 3)
    );

    game.undoMove();

    expect(
      game.board.getPiece(new Position(4, 4))
    ).toBe(knight);

    expect(
      game.board.getPiece(new Position(2, 3))
    ).toBeNull();

    expect(
      knight.position.equals(new Position(4, 4))
    ).toBe(true);

    expect(game.currentPlayer).toBe(COLORS.WHITE);
  });

  it("restores a captured piece", () => {
    const game = new Game();

    const whiteKnight = new Knight(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackKnight = new Knight(
      COLORS.BLACK,
      new Position(2, 3)
    );

    game.board.setPiece(
      whiteKnight.position,
      whiteKnight
    );

    game.board.setPiece(
      blackKnight.position,
      blackKnight
    );

    game.makeMove(
      new Position(4, 4),
      new Position(2, 3)
    );

    game.undoMove();

    expect(
      game.board.getPiece(new Position(4, 4))
    ).toBe(whiteKnight);

    expect(
      game.board.getPiece(new Position(2, 3))
    ).toBe(blackKnight);
  });

  it("throws an error when there is no move to undo", () => {
    const game = new Game();

    expect(() => {
      game.undoMove();
    }).toThrow("No moves to undo.");
  });
});

describe("Game - makeMove", () => {
  it("moves a piece and switches the turn", () => {
    const game = new Game();

    const knight = new Knight(
      COLORS.WHITE,
      new Position(4, 4)
    );

    game.board.setPiece(knight.position, knight);

    game.makeMove(
      new Position(4, 4),
      new Position(2, 3)
    );

    expect(
      game.board.getPiece(new Position(4, 4))
    ).toBeNull();

    expect(
      game.board.getPiece(new Position(2, 3))
    ).toBe(knight);

    expect(knight.position.equals(new Position(2, 3))).toBe(true);

    expect(game.currentPlayer).toBe(COLORS.BLACK);
  });

  it("records the move in move history", () => {
    const game = new Game();

    const knight = new Knight(
      COLORS.WHITE,
      new Position(4, 4)
    );

    game.board.setPiece(knight.position, knight);

    const from = new Position(4, 4);
    const to = new Position(2, 3);

    const move = game.makeMove(from, to);

    expect(game.moveHistory).toHaveLength(1);
    expect(game.moveHistory[0]).toBe(move);
    expect(move.piece).toBe(knight);
    expect(move.from).toBe(from);
    expect(move.to).toBe(to);
    expect(move.capturedPiece).toBeNull();
  });

  it("does not allow a player to move the opponent's piece", () => {
    const game = new Game();

    const blackKnight = new Knight(
      COLORS.BLACK,
      new Position(4, 4)
    );

    game.board.setPiece(
      blackKnight.position,
      blackKnight
    );

    expect(() => {
      game.makeMove(
        new Position(4, 4),
        new Position(2, 3)
      );
    }).toThrow("It is not this player's turn.");
  });

  it("throws an error when there is no piece at the starting position", () => {
    const game = new Game();

    expect(() => {
      game.makeMove(
        new Position(4, 4),
        new Position(2, 3)
      );
    }).toThrow("No piece at the starting position.");
  });

  it("records a captured piece", () => {
    const game = new Game();

    const whiteKnight = new Knight(
      COLORS.WHITE,
      new Position(4, 4)
    );

    const blackKnight = new Knight(
      COLORS.BLACK,
      new Position(2, 3)
    );

    game.board.setPiece(
      whiteKnight.position,
      whiteKnight
    );

    game.board.setPiece(
      blackKnight.position,
      blackKnight
    );

    const move = game.makeMove(
      new Position(4, 4),
      new Position(2, 3)
    );

    expect(move.capturedPiece).toBe(blackKnight);
  });
});