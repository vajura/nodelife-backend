import { Cell } from './life-cell-model';
import { cellFieldSocket } from '../server';

export class LifeSimulator {

  public cellField: Cell[][];
  public liveCells: Cell[];

  constructor(public width: number, public height: number, interval: number = 0) {
    this.cellField = LifeSimulator.generateField(width, height);
    this.liveCells = [];

    this.startSimulation(process.env.SIMULATION_INTERVAL | interval);
  }

  public startSimulation(interval: number) {
    setInterval(() => {
      const templiveCells: Cell[] = [];
      for (let a = 0; a < this.liveCells.length; a++) {

      }
    }, interval);
  }

  public addCells(cells: Cell[]) {

  }

  public static generateField(width: number, height: number) {
    const cellField: Cell[][] = [];
    for (let a = 0; a < height; a++) {
      cellField[a] = [];
      for (let b = 0; b < width; b++) {
        cellField[a][b] = new Cell(b, a);
      }
    }
    return cellField;
  }
}
