"use client";

import Button from "@repo/ui/button";
import Diamond from "@repo/ui/diamond";
import Input from "@repo/ui/input";
import Spade from "@repo/ui/spade";
import Table from "@repo/ui/table";
import { useEffect, useState } from "react";
import CreateRoomModal from "./createGameModal";
import JoinRoomModal from "./joinRoomModal";

export default function Page() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
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
          <Button kind="card" onPress={() => setIsJoinModalOpen(true)}>
            JOIN ROOM
            <Diamond className="h-6" />
          </Button>
        </div>
      </Table>
      <JoinRoomModal isOpen={isJoinModalOpen} setOpen={setIsJoinModalOpen} />
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />
    </main>
  );
}
