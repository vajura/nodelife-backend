import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { PlayerSocketInterface } from '../interfaces/player-socket-interface';
import { SocketEventEnum } from '../../commons/enums/socket-event-enum';
import { createPlayer, PlayerInterface } from '../../commons/interfaces/player-interface';
import { Cell } from '../models/cell-model';
import { lifeSimulator } from '../server';


export class SocketServer {
  public server: Server;
  public io: SocketIO.Server;
  public socketList: string[];
  public sockets: PlayerSocketInterface[];

  constructor(app: any) {
    this.socketList = [];
    this.sockets = [];
    this.server = createServer(app);
    this.io = socketIo(this.server);
    this.server.listen(process.env.SOCKET_PORT, () => {
      console.log('Running s on port %s\n', process.env.SOCKET_PORT);
    });
    this.cellFieldSocket();
  }

  cellFieldSocket() {
    this.io.on('connect', (socket: Socket) => {

      this.onConnect(socket);

      socket.on(SocketEventEnum.updatePlayerData, (data: PlayerInterface) => {
        this.updatePlayerData(socket, data);
      });

      socket.on(SocketEventEnum.addCells, (cells: any[]) => {
        this.addCells(socket, cells);
      });
      socket.on('disconnect', () => {
        this.onDisconnect(socket);
      });
    });
  }

  addCells(socket: Socket, cells: any[]) {
    lifeSimulator.addCells(socket, cells);
  }

  updatePlayerData(socket: Socket, data: PlayerInterface) {
    this.sockets[socket.id as any].viewPortY = data.viewPortY;
    this.sockets[socket.id as any].viewPortX = data.viewPortX;
    this.sockets[socket.id as any].viewPortW = data.viewPortW;
    this.sockets[socket.id as any].viewPortH = data.viewPortH;
    this.sockets[socket.id as any].zoom = data.zoom;
  }

  onConnect(socket: Socket) {
    this.socketList.push(socket.id);
    this.sockets[socket.id as any] = {
      s: socket,
      ...createPlayer()
    };
  }

  onDisconnect(socket: Socket) {
    for (let a = 0; a < this.socketList.length; a++) {
      if (this.socketList[a] === socket.id) {
        this.socketList.splice(a, 1);
        break;
      }
    }
    delete this.sockets[socket.id as any];
  }
}
