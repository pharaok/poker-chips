import { Socket as SocketIO } from "socket.io";
import { Room } from "./room.js";

export interface ClientToServerEvents {
  createRoom: (callback: (id: string) => void) => void;
  joinRoom: (name: string, id: string, callback: (room: Room) => void) => void;
  leaveRoom: () => void;
  startGame: () => void;
  checkCall: () => void;
  raise: (amount: number) => void;
  fold: () => void;
  chooseWinner: (p: number) => void;
}
export interface ServerToClientEvents {
  updateRoom: (room: Room) => void;
}

interface Player {
  id: string;
  name: string;
  stack: number;
  roundBet: number;
  didFold: boolean;
}
type Socket = SocketIO<ClientToServerEvents, ServerToClientEvents, {}, {}>;
