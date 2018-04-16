import { Cell } from './life-cell-model';
import { cellFieldSocket } from '../server';

export class LifeSimulator {

  public cellField: Cell[];
  public liveCells: Cell[];
  public neighboursHash: any[] = [];
  public numHash: number[] = [];

  constructor(public width: number, public height: number, interval: number = 0) {
    this.cellField = LifeSimulator.generateField(width, height);
    Cell.cellField = this.cellField;
    Cell.height = this.height;
    Cell.width = this.width;
    this.generateHash();
    this.liveCells = [];
    this.liveCells.push(new Cell(50, 50));
    this.liveCells.push(new Cell(50, 51));
    this.liveCells.push(new Cell(50, 52));
    this.liveCells.push(new Cell(49, 52));
    this.liveCells.push(new Cell(48, 51));
/*
Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
    for (let a = 1; a < 8; a++) {
      for (let b = 2; b < 8; b++) {
        this.numHash[Math.pow(a, 2) + Math.pow(b, 2)] = 2;
        for (let c = 3; c < 8; c++) {
          this.numHash[Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)] = 3;
        }
      }
    }

    this.startSimulation(process.env.SIMULATION_INTERVAL | interval);
  }

  public startSimulation(interval: number) {
    setInterval(() => {
      const tempLiveCells: Cell[] = [];
      const neighbourCells: number[] = [];
      const indexArray: number[] = [];
      for (let a = 0; a < this.liveCells.length; a++) {
        this.liveCells[a].liveNeighbours = this.calculateNeighbours(this.liveCells[a].x, this.liveCells[a].y);
      }
      for (let a = 0; a < this.liveCells.length; a++) {
        if (this.numHash[this.liveCells[a].liveNeighbours]) {
          tempLiveCells.push(this.liveCells[a]);
        }
      }
      for (let a = 0; a < this.liveCells.length; a++) {
        for (let b = 0; b < this.neighboursHash.length; b++) {
          const indexX = this.liveCells[a].x + this.neighboursHash[b].x;
          const indexY = this.liveCells[a].y * this.width + this.neighboursHash[b].y;
          const index = indexX + indexY;
          if (!neighbourCells[index]) {
            neighbourCells[index] = this.calculateNeighbours(indexX, indexY);
          }
        }
      }
      if (cellFieldSocket.socket) {
        cellFieldSocket.socket.send(tempLiveCells);
        this.liveCells = tempLiveCells;
      }
    }, interval);
  }

  public calculateNeighbours(x: number, y: number): number {
    let liveNeighbours = 0;
    if (this.cellField[y * this.width + x + this.neighboursHash[0].x + this.neighboursHash[0].y]) {
      liveNeighbours += this.neighboursHash[0].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[1].x + this.neighboursHash[1].y]) {
      liveNeighbours += this.neighboursHash[1].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[2].x + this.neighboursHash[2].y]) {
      liveNeighbours += this.neighboursHash[2].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[3].x + this.neighboursHash[3].y]) {
      liveNeighbours += this.neighboursHash[3].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[4].x + this.neighboursHash[4].y]) {
      liveNeighbours += this.neighboursHash[4].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[5].x + this.neighboursHash[5].y]) {
      liveNeighbours += this.neighboursHash[5].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[6].x + this.neighboursHash[6].y]) {
      liveNeighbours += this.neighboursHash[6].m;
    }
    if (this.cellField[y * this.width + x + this.neighboursHash[7].x + this.neighboursHash[7].y]) {
      liveNeighbours += this.neighboursHash[7].m;
    }
    return liveNeighbours;
  }

  private generateHash() {
    this.neighboursHash = [{x: -1, y: -this.width, m: 1}, {x: 0, y: -this.width, m: 2}, {x: 1, y: -this.width, m: 4},
      {x: -1, y: 0, m: 8}, {x: 0, y: 0, m: 16}, {x: 1, y: 0, m: 32},
      {x: -1, y: this.width, m: 64}, {x: 0, y: this.width, m: 128}, {x: 1, y: this.width, m: 256}];
  }

  public addCells(cells: Cell[]) {

  }

  public static generateField(width: number, height: number) {
    const cellField: Cell[] = [];
    for (let a = 0; a < height; a++) {
      for (let b = 0; b < width; b++) {
        cellField[a * width + b] = undefined;
      }
    }
    return cellField;
  }
}
