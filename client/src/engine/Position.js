export default class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  equals(otherPosition) {
    return (
      this.row === otherPosition.row &&
      this.col === otherPosition.col
    );
  }

  isValid() {
    return (
      this.row >= 0 &&
      this.row < 8 &&
      this.col >= 0 &&
      this.col < 8
    );
  }
}