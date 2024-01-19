import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import { nanoid } from "nanoid";

const server = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(
  server,
  {
    cors: { origin: "http://localhost:3000" },
  },
);

io.on("connection", (socket) => {
  socket.on("createRoom", (callback) => {
    const id = nanoid(8);
    callback(id);
    socket.join(id);
  });
  socket.on("joinRoom", (id) => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(id);
  });
});

server.listen(3001, () => {
  console.log("listening on 3001");
});
