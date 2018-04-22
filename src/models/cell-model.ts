import { Socket } from 'socket.io';

export class Cell {

  public alive: number;
  public ignore: boolean;
  public color: any;
  public owner: Socket;
  public liveNeighbours = 0;
  public index: number;

  public static cellField: Cell[];
  public static height: number;
  public static width: number;

  constructor(public x: number, public y: number) {
    this.alive = 1;
    this.ignore = true;
    this.color = 0xFF000000;
    const index = y * Cell.width + x;
    this.index = index;
    Cell.cellField[index] = this;
  }
}
