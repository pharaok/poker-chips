"use client";

import Button from "@repo/ui/button";
import Diamond from "@repo/ui/diamond";
import Spade from "@repo/ui/spade";
import Table from "@repo/ui/table";
import Modal from "@repo/ui/modal";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../server/src/types";
import Input from "@repo/ui/input";

export default function Page() {
  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>();
  useEffect(() => {
    socket.current = io("http://localhost:3001");
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div className="flex flex-col justify-center gap-4 p-12 text-2xl">
          <Button
            card
            onClick={() => {
              socket.current?.emit("createRoom", (id: string) => {
                console.log("created room with id", id);
              });
            }}
          >
            CREATE ROOM
            <Spade className="h-6" />
          </Button>
          <Button card onClick={() => setModalVisible(true)}>
            JOIN ROOM
            <Diamond className="h-6" />
          </Button>
        </div>
      </Table>
      <Modal
        visible={modalVisible}
        setVisible={setModalVisible}
        title="Room Code"
      >
        <div className="flex w-full flex-col items-center gap-4">
          <Input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="CODE"
          />
          <Button
            className="self-end"
            onClick={() => {
              socket.current?.emit("joinRoom", roomCode);
            }}
          >
            JOIN
          </Button>
        </div>
      </Modal>
    </main>
  );
}
