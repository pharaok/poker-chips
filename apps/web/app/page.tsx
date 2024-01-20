"use client";

import Button from "@repo/ui/button";
import Diamond from "@repo/ui/diamond";
import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import Spade from "@repo/ui/spade";
import Table from "@repo/ui/table";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    setName(localStorage.getItem("name") || "");
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div className="flex w-96 flex-col justify-center gap-4 p-12 text-2xl">
          {/* HACK: */}
          <input
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => localStorage.setItem("name", name)}
            className="w-full rounded-full bg-black/50 px-6 py-2 text-white"
          ></input>
          <Button
            type="card"
            onClick={() => {
              socket.emit("createRoom", (id: string) => {
                console.log(id);
                router.push(`/room/${id}`);
              });
            }}
          >
            CREATE ROOM
            <Spade className="h-6" />
          </Button>
          <Button type="card" onClick={() => setModalVisible(true)}>
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
              router.push(`/room/${roomCode}`);
            }}
          >
            JOIN
          </Button>
        </div>
      </Modal>
    </main>
  );
}
