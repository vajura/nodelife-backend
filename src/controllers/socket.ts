import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import { SocketTypeEnum } from '../models/socket-type-enum';

export class SocketServer {
  public server: Server;
  public io: SocketIO.Server;

  constructor(app: any, socketType: SocketTypeEnum) {
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
    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', process.env.SOCKET_PORT);
      socket.on('message', (m: any) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
}
