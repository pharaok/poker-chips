import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  Socket,
  ServerToClientEvents,
} from "@repo/utils";
import { nanoid } from "nanoid";
import { Room, Player } from "@repo/utils/room";
import { parse, serialize } from "cookie";
import "dotenv/config";

const server = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(
  server,
  {
    addTrailingSlash: false,
    connectionStateRecovery: {
      maxDisconnectionDuration: 30 * 1000,
    },
    cors: {
      origin: ["http://localhost:3000", process.env.ORIGIN].filter(
        (o) => o,
      ) as string[],
      credentials: true,
    },
  },
);

io.engine.on("initial_headers", (headers, request) => {
  const cookie = parse(request.headers.cookie || "");
  if (!cookie.id)
    headers["set-cookie"] = serialize("id", nanoid(), { maxAge: 86400 });
});

const rooms: { [id: string]: Room } = {};
const playerRoom: { [id: string]: string } = {};
const recovery: { [id: string]: { roomId: string; socketId: string } } = {};

const leaveRoom = (socket: Socket) => {
  const rId = playerRoom[socket.id];
  if (!rId) return;

  const room = rooms[rId]!;
  socket.leave(rId);
  room.getUp(socket.id);
  room.leaveTable(socket.id);
  io.to(rId).emit("updateRoom", room);
  if (room.players.length === 0) {
    delete rooms[rId];
  }
  delete playerRoom[socket.id];
};

io.on("connection", (socket) => {
  let cId: string | undefined;
  if (socket.request.headers.cookie) {
    cId = parse(socket.request.headers.cookie).id!;
    if (recovery[cId]) {
      // reconnect
      const { roomId, socketId: prevId } = recovery[cId]!;
      socket.join(roomId);
      const room = rooms[roomId]!;
      const player = room.players.find((p) => p.id === prevId)!;
      player.id = socket.id;
      player.isDisconnected = false;
      playerRoom[socket.id] = roomId;

      delete recovery[cId];
      delete playerRoom[prevId];

      console.log("recover:", cId);
    }
  }
  console.log("connect:", cId);
  socket.on("createRoom", (name, buyIn, smallBlind, bigBlind, callback) => {
    const id = nanoid(8);
    rooms[id] = new Room(name, buyIn, smallBlind, bigBlind);

    callback(id);
  });
  socket.on("joinRoom", (name, rId, callback) => {
    if (!rooms[rId]) {
      callback(null);
      return;
    }
    const room = rooms[rId]!;
    // leave all other rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    const player: Player = {
      id: socket.id,
      name,
      stack: room.buyIn,
      roundBet: 0,
      potContribution: 0,
      isFolded: false,
      isPlaying: true,
      isDisconnected: false,
      lastAction: null,
    };
    if (!room.players.some((p) => p.id === socket.id)) {
      room.joinTable(player);
      playerRoom[socket.id] = rId;
    }
    socket.join(rId);
    callback(room);
    io.to(rId).emit("updateRoom", room);
  });
  socket.on("sitDownAt", (at) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;

    room.sitDownAt(socket.id, at);
    io.to(rId).emit("updateRoom", room);
  });
  socket.on("getUp", () => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;

    room.getUp(socket.id);
    io.to(rId).emit("updateRoom", room);
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
    if (socket.id !== room.turn?.id) return;

    room.callRaise();
    room.advanceTurn();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("raise", (amount) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.turn?.id) return;

    room.callRaise(amount);
    room.advanceTurn();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("fold", () => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.turn?.id) return;

    room.fold();
    room.advanceTurn();

    io.to(rId).emit("updateRoom", room);
  });
  socket.on("selectWinners", (pIds) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.admin?.id) return;

    room.chooseWinner(pIds);
    io.to(rId).emit("updateRoom", room);
  });
  socket.on("setStack", (i, stack) => {
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    if (socket.id !== room.admin?.id) return;

    room.players[i]!.stack = stack;
    io.to(rId).emit("updateRoom", room);
  });

  socket.on("getRooms", (callback) => {
    const rs = Object.entries(rooms).map(([code, room]) => {
      const { name, buyIn, smallBlind, bigBlind } = room;
      return {
        code,
        name,
        host: room.admin!.name,
        buyIn,
        smallBlind,
        bigBlind,
        playerCount: room.players.filter((p) => !p.isDisconnected).length,
      };
    });
    callback(rs);
  });

  socket.on("leaveRoom", () => {
    leaveRoom(socket);
  });
  socket.on("disconnect", () => {
    if (!cId) return;
    const rId = playerRoom[socket.id];
    if (!rId) return;
    const room = rooms[rId]!;
    recovery[cId] = { roomId: rId, socketId: socket.id };
    setTimeout(() => {
      leaveRoom(socket);
      delete recovery[cId!];
    }, 30 * 1000);
    room.players.find((p) => p.id === socket.id)!.isDisconnected = true;
    io.to(rId).emit("updateRoom", room);
    console.log("disconnect:", cId);
  });
});

server.listen(3001, () => {
  console.log("listening on 3001");
});
