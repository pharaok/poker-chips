import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@repo/utils";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://192.168.13.226:3001",
);
