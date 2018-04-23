import { PlayerSocketInterface } from '../interfaces/player-socket-interface';

export class Cell {

  public ignore: boolean;
  public liveNeighbours = 0;
  public index: number;
  public color: number;

  public static cellField: Cell[];
  public static height: number;
  public static width: number;

  constructor(public x: number, public y: number, public owner: PlayerSocketInterface, public alive: number) {
    this.ignore = true;
    const index = y * Cell.width + x;
    this.index = index;
    this.color = owner.color;
    Cell.cellField[index] = this;
  }
}
