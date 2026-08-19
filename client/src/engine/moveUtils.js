import Position from "./Position";

export function rayCast(board, startPosition, directions, color) {
  const moves = [];

  for (const [rowDirection, colDirection] of directions) {
    let row = startPosition.row + rowDirection;
    let col = startPosition.col + colDirection;

    while (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const position = new Position(row, col);
      const targetPiece = board.getPiece(position);

      if (!targetPiece) {
        moves.push(position);
      } else {
        if (targetPiece.color !== color) {
          moves.push(position);
        }

        break;
      }

      row += rowDirection;
      col += colDirection;
    }
  }

  return moves;
}