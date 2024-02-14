import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@repo/utils";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SERVER!,
  {
    withCredentials: true,
  },
);
