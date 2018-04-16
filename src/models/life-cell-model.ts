export class Cell {

  public alive: number;
  public ignore: boolean;
  public color: any;
  public owner: any;
  public liveNeighbours = 0;
  public static cellField: Cell[];
  public static height: number;
  public static width: number;

  constructor(public x: number, public y: number) {
    this.alive = 1;
    this.ignore = true;
    this.color = 0;
    Cell.cellField[y * Cell.width + x] = this;
  }
}
