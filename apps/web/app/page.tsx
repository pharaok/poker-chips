"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Page() {
  const socket = useRef<Socket<{}, {}> | null>();
  useEffect(() => {
    socket.current = io("http://localhost:3001");
    console.log("in here");
  }, []);

  return <main>hello world</main>;
}
