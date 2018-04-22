import { Socket } from 'socket.io';
import { PlayerInterface } from '../../commons/interfaces/player-interface';

export interface PlayerSocketInterface extends PlayerInterface {
  s?: Socket;
}
