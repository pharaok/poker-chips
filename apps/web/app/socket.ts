import { Socket, io } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../server/src/types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3001",
);
