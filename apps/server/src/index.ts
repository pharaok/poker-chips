import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, Player, ServerToClientEvents } from "./types.js";
import { nanoid } from "nanoid";

const server = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(
  server,
  {
    cors: { origin: "http://localhost:3000" },
  },
);

const rooms: { [id: string]: Player[] } = {};
const playerRoom: { [id: string]: string } = {};

io.on("connection", (socket) => {
  socket.on("createRoom", (callback) => {
    const id = nanoid(8);
    rooms[id] = [];

    callback(id);
  });
  socket.on("joinRoom", (name, rId, callback) => {
    if (!rooms[rId]) {
      rooms[rId] = [];
    }
    // leave all other rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    const player: Player = { id: socket.id, name, stack: 10000 };
    if (!rooms[rId]!.some((p) => p.id == socket.id)) {
      rooms[rId]!.push(player);
      playerRoom[socket.id] = rId;
    }
    socket.join(rId);
    callback(rooms[rId]!);
    socket.to(rId).emit("updatePlayers", rooms[rId]!);
  });

  socket.on("disconnect", () => {
    const rId = playerRoom[socket.id];
    if (rId && rooms[rId]) {
      rooms[rId] = rooms[rId]!.filter((p) => p.id !== socket.id);
      if (rooms[rId]!.length === 0) {
        delete rooms[rId];
      }
      socket.to(rId).emit("updatePlayers", rooms[rId]!);
    }
    delete playerRoom[socket.id];
  });
});

server.listen(3001, () => {
  console.log("listening on 3001");
});
