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
    this.generateNeighboursHash();
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
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        for (let c = 0; c < 8; c++) {
          if (a != b && a != c && b != c) {
            this.numHash[Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)] = 3;
          }
        }
      }
    }
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        if (a != b) {
          this.numHash[Math.pow(a, 2) + Math.pow(b, 2)] = 2;
        }
      }
    }
    this.startSimulation(process.env.SIMULATION_INTERVAL | interval);
  }

  public startSimulation(interval: number) {
    setInterval(() => {
      const tempLiveCells: Cell[] = [];
      const neighbourCells: any[] = [];
      const indexArray: number[] = [];
      const markedForDeletion: number[] = [];
      console.log('NEW GEN');
      console.log();
      for (let a = 0; a < this.liveCells.length; a++) {
        this.liveCells[a].liveNeighbours = this.calculateNeighbours(this.liveCells[a].x, this.liveCells[a].y);
      }
      for (let a = 0; a < this.liveCells.length; a++) {
        console.log(a);
        console.log(this.liveCells[a]);
        console.log('NUM HASH: ' + this.numHash[this.liveCells[a].liveNeighbours]);
        if (this.numHash[this.liveCells[a].liveNeighbours]) {
          tempLiveCells.push(this.liveCells[a]);
          console.log('LIVE ' + a);
        }
        else {
          markedForDeletion.push(this.liveCells[a].index);
          console.log('DED ' + a);
        }
        console.log();
      }
      console.log('NEW CELLS');
      for (let a = 0; a < this.liveCells.length; a++) {
        for (let b = 0; b < this.neighboursHash.length; b++) {
          const indexX = this.liveCells[a].x + this.neighboursHash[b].x;
          const indexY = this.liveCells[a].y + this.neighboursHash[b].y;
          const index = (indexY) * this.width + indexX;
          console.log(index);
          console.log(!neighbourCells[index]);
          console.log(!this.cellField[index]);
          console.log(this.calculateNeighbours(indexX, indexY));
          console.log('ALIVE ', this.numHash[this.calculateNeighbours(indexX, indexY, true)]);
          console.log();
          if (!neighbourCells[index] &&
          !this.cellField[index] &&
          this.numHash[this.calculateNeighbours(indexX, indexY)] === 3) {
            neighbourCells[index] = {};
            neighbourCells[index].x = indexX;
            neighbourCells[index].y = indexY;
            indexArray.push(index);
          } else {
            neighbourCells[index] = true;
          }
        }
      }
      for (let a = 0; a < markedForDeletion.length; a++) {
        this.cellField[markedForDeletion[a]] = undefined;
      }
      for (let a = 0; a < indexArray.length; a++) {
        tempLiveCells.push(new Cell(neighbourCells[indexArray[a]].x, neighbourCells[indexArray[a]].y));
      }
      if (cellFieldSocket.socket) {
        cellFieldSocket.socket.send(tempLiveCells);
        this.liveCells = tempLiveCells;
      }
    }, 3000);
  }

  public calculateNeighbours(x: number, y: number, verbose = false): number {
    let liveNeighbours = 0;
    if (this.cellField[(y + this.neighboursHash[0].y) * this.width + x + this.neighboursHash[0].x]) {
      liveNeighbours += this.neighboursHash[0].m;
      if (verbose) {
        console.log(0);
      }
    }
    if (this.cellField[(y + this.neighboursHash[1].y) * this.width + x + this.neighboursHash[1].x]) {
      liveNeighbours += this.neighboursHash[1].m;
      if (verbose) {
        console.log(1);
      }
    }
    if (this.cellField[(y + this.neighboursHash[2].y) * this.width + x + this.neighboursHash[2].x]) {
      liveNeighbours += this.neighboursHash[2].m;
      if (verbose) {
        console.log(2);
      }
    }
    if (this.cellField[(y + this.neighboursHash[3].y) * this.width + x + this.neighboursHash[3].x]) {
      liveNeighbours += this.neighboursHash[3].m;
      if (verbose) {
        console.log(3);
      }
    }
    if (this.cellField[(y + this.neighboursHash[4].y) * this.width + x + this.neighboursHash[4].x]) {
      liveNeighbours += this.neighboursHash[4].m;
      if (verbose) {
        console.log(4);
      }
    }
    if (this.cellField[(y + this.neighboursHash[5].y) * this.width + x + this.neighboursHash[5].x]) {
      liveNeighbours += this.neighboursHash[5].m;
      if (verbose) {
        console.log(5);
      }
    }
    if (this.cellField[(y + this.neighboursHash[6].y) * this.width + x + this.neighboursHash[6].x]) {
      liveNeighbours += this.neighboursHash[6].m;
      if (verbose) {
        console.log(6);
      }
    }
    if (this.cellField[(y + this.neighboursHash[7].y) * this.width + x + this.neighboursHash[7].x]) {
      liveNeighbours += this.neighboursHash[7].m;
      if (verbose) {
        console.log(7);
      }
    }
    return liveNeighbours;
  }

  private generateNeighboursHash() {
    this.neighboursHash = [{x: -1, y: -1, m: 1}, {x: 0, y: -1, m: 2}, {x: 1, y: -1, m: 4},
                           {x: -1, y: 0, m: 8},                       {x: 1, y: 0, m: 16},
                           {x: -1, y: 1, m: 32}, {x: 0, y: 1, m: 64}, {x: 1, y: 1, m: 128}];
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
