import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  Socket,
  Player,
  ServerToClientEvents,
} from "@repo/utils";
import { nanoid } from "nanoid";
import { Room } from "@repo/utils/room";

const server = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(
  server,
  {
    connectionStateRecovery: {
      maxDisconnectionDuration: 5 * 60 * 1000,
    },
    cors: { origin: "*" },
  },
);

const rooms: { [id: string]: Room } = {};
const playerRoom: { [id: string]: string } = {};

const leaveRoom = (socket: Socket) => {
  const rId = playerRoom[socket.id];
  if (rId && rooms[rId]) {
    socket.leave(rId);
    rooms[rId]?.leaveTable(socket.id);
    io.to(rId).emit("updateRoom", rooms[rId]!);
    if (rooms[rId]!.players.length === 0) {
      delete rooms[rId];
    }
  }
  delete playerRoom[socket.id];
};

io.on("connection", (socket) => {
  socket.on("createRoom", (callback) => {
    const id = nanoid(8);
    rooms[id] = new Room();

    callback(id);
  });
  socket.on("joinRoom", (name, rId, callback) => {
    if (!rooms[rId]) {
      rooms[rId] = new Room();
    }
    // leave all other rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    const player: Player = {
      id: socket.id,
      name,
      stack: 10000,
      roundBet: 0,
      potContribution: 0,
      didFold: false,
    };
    if (!rooms[rId]!.players.some((p) => p.id == socket.id)) {
      rooms[rId]!.players.push(player);
      playerRoom[socket.id] = rId;
    }
    socket.join(rId);
    callback(rooms[rId]!);
    io.to(rId).emit("updateRoom", rooms[rId]!);
  });

  socket.on("startGame", () => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[0]?.id) return;

    room.startGame();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("checkCall", () => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[room.turn]?.id) return;

    room.callRaise();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("raise", (amount) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[room.turn]?.id) return;

    room.callRaise(amount);

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("fold", () => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[room.turn]?.id) return;

    room.fold();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("selectWinners", (ps) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[0]?.id) return;

    room.chooseWinner(ps);
    io.to(rId).emit("updateRoom", room);
  });
  socket.on("setStack", (i, stack) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.players[0]?.id) return;

    room.players[i]!.stack = stack;
    io.to(rId).emit("updateRoom", room);
  });

  socket.on("leaveRoom", () => {
    leaveRoom(socket);
  });
  socket.on("disconnect", () => {
    leaveRoom(socket);
  });
});

server.listen(3001, () => {
  console.log("listening on 3001");
});
