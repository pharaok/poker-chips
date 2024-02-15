"use client";

import Button from "@repo/ui/button";
import Diamond from "@repo/ui/diamond";
import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import Spade from "@repo/ui/spade";
import Table from "@repo/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateGameModal from "./createGameModal";

export default function Page() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    setName(localStorage.getItem("name") || "");
  }, []);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div className="flex w-96 flex-col justify-center gap-4 p-8 text-2xl">
          <Input
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => localStorage.setItem("name", name)}
            className="bg-black/50"
          ></Input>
          <Button kind="card" onPress={() => setIsCreateModalOpen(true)}>
            CREATE ROOM
            <Spade className="h-6" />
          </Button>
          <Button kind="card" onPress={() => setModalVisible(true)}>
            JOIN ROOM
            <Diamond className="h-6" />
          </Button>
        </div>
      </Table>
      <Modal
        isDismissable
        isOpen={modalVisible}
        onOpenChange={setModalVisible}
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
            onPress={() => {
              router.push(`/room/${roomCode}`);
            }}
          >
            JOIN
          </Button>
        </div>
      </Modal>
      <CreateGameModal
        isOpen={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />
    </main>
  );
}
