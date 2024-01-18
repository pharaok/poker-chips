"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Table from "@repo/ui/table";
import Button from "@repo/ui/button";
import Spade from "@repo/ui/spade";
import Diamond from "@repo/ui/diamond";

export default function Page() {
  const socket = useRef<Socket<{}, {}> | null>();
  useEffect(() => {
    socket.current = io("http://localhost:3001");
    console.log("in here");
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div className="flex flex-col justify-center gap-4 text-2xl">
          <Button>
            CREATE ROOM
            <Spade className="h-6" />
          </Button>
          <Button>
            JOIN ROOM
            <Diamond className="h-6" />
          </Button>
        </div>
      </Table>
    </main>
  );
}
