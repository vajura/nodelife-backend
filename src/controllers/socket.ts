import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import { SocketTypeEnum } from '../models/socket-type-enum';
import { Socket } from 'socket.io';


export class SocketServer {
  public server: Server;
  public io: SocketIO.Server;
  public socketList: string[];
  public sockets: Socket[];

  constructor(app: any, socketType: SocketTypeEnum) {
    this.socketList = [];
    this.sockets = [];
    this.server = createServer(app);
    this.io = socketIo(this.server);
    this.server.listen(process.env.SOCKET_PORT, () => {
      console.log('Running socket on port %s\n', process.env.SOCKET_PORT);
    });

    if (socketType === SocketTypeEnum.CELL_FIELD) {
      this.cellFieldSocket();
    }
  }

  cellFieldSocket() {
    this.io.on('connect', (socket: Socket) => {
      this.onConnect(socket);
      socket.on('disconnect', () => {
        this.onDisconnect(socket);
        console.log('Client disconnected');
      });
      console.log('Connected client on port %s.', process.env.SOCKET_PORT);
    });
  }

  onConnect(socket: Socket) {
    this.socketList.push(socket.id);
    this.sockets[socket.id as any] = socket;
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
