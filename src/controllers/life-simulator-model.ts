import { socketServer } from '../server';
import { Cell } from '../models/cell-model';
import { SocketEventEnum } from '../../commons/enums/socket-event-enum';
import { Socket } from 'socket.io';
import {PlayerSocketInterface} from '../interfaces/player-socket-interface';

export class LifeSimulator {

  public cellField: Cell[];
  public liveCells: Cell[];
  public neighboursHash: any[] = [];
  public numHash: number[] = [];

  constructor(public width: number, public height: number, interval: number) {
    this.cellField = LifeSimulator.generateField(width, height);
    Cell.cellField = this.cellField;
    Cell.height = this.height;
    Cell.width = this.width;
    this.liveCells = [];
    this.generateHashField();
    this.generateNeighboursHash();
    this.startSimulation(interval);
    this.startSocketCommunication(interval);
  }

  public startSimulation(interval: number) {
    setTimeout(() => {
      const tempLiveCells: Cell[] = [];
      const neighbourCells: any[] = []; // TODO CREATE INTERFACE
      const indexArray: number[] = [];
      const markedForDeletion: number[] = [];
      for (let a = 0; a < this.liveCells.length; a++) {
        this.liveCells[a].liveNeighbours = this.calculateNeighbours(this.liveCells[a].x, this.liveCells[a].y);
        if (this.numHash[this.liveCells[a].liveNeighbours] && this.liveCells[a].alive > 0) {
          this.liveCells[a].alive--;
          tempLiveCells.push(this.liveCells[a]);
        }
        else {
          markedForDeletion.push(this.liveCells[a].index);
        }
      }
      for (let a = 0; a < this.liveCells.length; a++) {
        for (let b = 0; b < this.neighboursHash.length; b++) {
          const indexX = this.liveCells[a].x + this.neighboursHash[b].x;
          const indexY = this.liveCells[a].y + this.neighboursHash[b].y;
          const index = (indexY) * this.width + indexX;
          if (indexX > 1 && indexX < this.width - 1 &&
            indexY > 1 && indexY < this.height - 1 &&
            !neighbourCells[index] &&
            !this.cellField[index] &&
            this.numHash[this.calculateNeighbours(indexX, indexY)] === 3) {
            neighbourCells[index] = {};
            neighbourCells[index].owner = this.liveCells[a].owner;
            neighbourCells[index].alive = this.liveCells[a].alive;
            neighbourCells[index].x = indexX;
            neighbourCells[index].y = indexY;
            indexArray.push(index);
          } else if (!neighbourCells[index]) {
            neighbourCells[index] = true;
          }
        }
      }
      for (let a = 0; a < markedForDeletion.length; a++) {
        this.cellField[markedForDeletion[a]] = undefined;
      }
      for (let a = 0; a < indexArray.length; a++) {
        tempLiveCells.push(new Cell(neighbourCells[indexArray[a]].x,
          neighbourCells[indexArray[a]].y,
          neighbourCells[indexArray[a]].owner,
          neighbourCells[indexArray[a]].alive));
      }
      this.liveCells = tempLiveCells;
      this.startSimulation(interval);
    }, interval);
  }

  public startSocketCommunication(interval: number) {
    setTimeout(() => {
      for (let a = 0; a < socketServer.socketList.length; a++) {
        const socket: PlayerSocketInterface = socketServer.sockets[socketServer.socketList[a] as any];
        if (socket.s.connected) {
          const viewPortCells: Cell[] = [];
          let dataArray: Int16Array;
          try {
            // TODO might be able to speed this up with calculating beforehand
            for (let b = 0; b < socket.viewPortH; b++) {
              const xPos = (b + socket.viewPortY) * this.width;
              for (let c = 0; c < socket.viewPortW; c++) {
                const yPos = c + socket.viewPortX;
                const cell = this.cellField[xPos + yPos];
                if (cell) {
                  viewPortCells.push(cell);
                }
              }
            }
            dataArray = new Int16Array(viewPortCells.length * 3 + 1);
            dataArray[0] = viewPortCells.length * 3 + 1;
            for (let b = 0; b < viewPortCells.length; b++) {
              dataArray[1 + b * 3] = viewPortCells[b].x;
              dataArray[2 + b * 3] = viewPortCells[b].y;
              dataArray[3 + b * 3] = viewPortCells[b].color;
            }
          } catch (error) {
            console.log('NEEDS TO BE THREAD SAFE', error);
          }
          socket.s.emit(SocketEventEnum.updateField, dataArray);
        }
      }
      this.startSocketCommunication(interval);
    }, interval);
  }
  // TODO add interface for x and y position of cells
  public addCells(socket: Socket, cells: any[]) {
    for (let a = 0; a < cells.length; a++) {
      this.liveCells.push(new Cell(cells[a].x, cells[a].y, socketServer.sockets[socket.id as any], 1000));
    }
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

  public calculateNeighbours(x: number, y: number): number {
    let liveNeighbours = 0;
    if (this.cellField[(y + this.neighboursHash[0].y) * this.width + x + this.neighboursHash[0].x]) {
      liveNeighbours += this.neighboursHash[0].m;
    }
    if (this.cellField[(y + this.neighboursHash[1].y) * this.width + x + this.neighboursHash[1].x]) {
      liveNeighbours += this.neighboursHash[1].m;
    }
    if (this.cellField[(y + this.neighboursHash[2].y) * this.width + x + this.neighboursHash[2].x]) {
      liveNeighbours += this.neighboursHash[2].m;
    }
    if (this.cellField[(y + this.neighboursHash[3].y) * this.width + x + this.neighboursHash[3].x]) {
      liveNeighbours += this.neighboursHash[3].m;
    }
    if (this.cellField[(y + this.neighboursHash[4].y) * this.width + x + this.neighboursHash[4].x]) {
      liveNeighbours += this.neighboursHash[4].m;
    }
    if (this.cellField[(y + this.neighboursHash[5].y) * this.width + x + this.neighboursHash[5].x]) {
      liveNeighbours += this.neighboursHash[5].m;
    }
    if (this.cellField[(y + this.neighboursHash[6].y) * this.width + x + this.neighboursHash[6].x]) {
      liveNeighbours += this.neighboursHash[6].m;
    }
    if (this.cellField[(y + this.neighboursHash[7].y) * this.width + x + this.neighboursHash[7].x]) {
      liveNeighbours += this.neighboursHash[7].m;
    }
    return liveNeighbours;
  }

  private generateHashField() {
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        if (a != b) {
          const num = Math.pow(2, a) + Math.pow(2, b);
          this.numHash[Number(num)] = 2;
          for (let c = 0; c < 8; c++) {
            if (a != c && b != c) {
              const num2 = Math.pow(2, a) + Math.pow(2, b) + Math.pow(2, c);
              this.numHash[Number(num2)] = 3;
            }
          }
        }
      }
    }
  }

  private generateNeighboursHash() {
    this.neighboursHash = [{x: -1, y: -1, m: 1}, {x: 0, y: -1, m: 2}, {x: 1, y: -1, m: 4},
      {x: -1, y: 0, m: 8},                       {x: 1, y: 0, m: 16},
      {x: -1, y: 1, m: 32}, {x: 0, y: 1, m: 64}, {x: 1, y: 1, m: 128}];
  }
}
