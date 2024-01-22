"use client";

import Table from "@repo/ui/table";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { Room } from "../../../../server/src/room"; // HACK:
import Button from "@repo/ui/button";
import { StepForward } from "lucide-react";

const getPointOnPill = (
  clientWidth: number,
  clientHeight: number,
  distance: number,
) => {
  const isPortrait = clientHeight > clientWidth;

  let sideLength = Math.abs(clientWidth - clientHeight);
  let pillRadius = Math.min(clientWidth, clientHeight) / 2;
  const perimeter = 2 * Math.PI * pillRadius + 2 * sideLength;
  sideLength /= perimeter;
  pillRadius /= perimeter;

  // start from bottom middle;
  if (isPortrait) {
    distance += sideLength + 0.5 * Math.PI * pillRadius;
  } else {
    distance += sideLength * 1.5 + Math.PI * pillRadius;
  }
  distance %= 1;

  // HACK:-y?
  let segments: { length: number; delta: (d: number) => [number, number] }[] = [
    {
      length: sideLength,
      delta: (d: number) => [d, 0],
    },
    {
      length: Math.PI * pillRadius,
      delta: (d: number) => {
        let arcLength = d / pillRadius;
        return [
          Math.sin(arcLength) * pillRadius,
          -(Math.cos(arcLength) - 1) * pillRadius,
        ];
      },
    },
    {
      length: sideLength,
      delta: (d: number) => [-d, 0],
    },
    {
      length: Math.PI * pillRadius,
      delta: (d: number) => {
        let arcLength = d / pillRadius;
        return [
          -Math.sin(arcLength) * pillRadius,
          (Math.cos(arcLength) - 1) * pillRadius,
        ];
      },
    },
  ];

  let [x, y] = [pillRadius, 0];
  segments.forEach((seg) => {
    const d = Math.min(distance, seg.length);
    const [dx, dy] = seg.delta(d);
    x += dx;
    y += dy;
    distance -= d;
  });

  if (isPortrait) {
    return [clientWidth - y * perimeter, x * perimeter];
  }
  return [x, y].map((p) => p * perimeter);
};

export default function Page({ params }: { params: { code: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const j = room?.players.findIndex((p) => p.id === socket.id);

  useEffect(() => {
    socket.emit(
      "joinRoom",
      localStorage.getItem("name") || "Player",
      params.code,
      (room) => {
        setRoom(room);
        setIsAdmin(room.players[0]!.id === socket.id);
      },
    );
    socket.on("updateRoom", (room) => {
      setRoom(room);
      setIsAdmin(room.players[0]!.id === socket.id);
    });
    return () => {
      socket.off("updateRoom");
      socket.emit("leaveRoom");
    };
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex w-full flex-grow items-center justify-center">
        <Table>
          {room && (
            <>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl text-white">{room.phase}</span>
                <span className="text-3xl text-white">{room.pot}</span>
              </div>
              <div ref={tableRef} className="absolute -m-12 h-full w-full">
                {room.players.map((p, i, a) => {
                  if (tableRef.current === null) {
                    return;
                  }
                  const { clientWidth, clientHeight } = tableRef.current!;

                  const [x, y] = getPointOnPill(
                    clientWidth,
                    clientHeight,
                    ((i - j! + a.length) % a.length) / a.length,
                  );
                  return (
                    <div
                      key={i}
                      className={`absolute flex -translate-x-[50%] -translate-y-[50%] flex-col items-center rounded-lg bg-gray-800/75 px-6 py-2 text-white ${
                        i === room.turn ? "border-4 border-white" : ""
                      }`}
                      style={{
                        left: x,
                        top: y,
                      }}
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-lg">{p.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{p.stack}</span>
                      <div className="absolute -right-8 flex flex-col justify-evenly gap-2 [&>*]:flex [&>*]:h-6 [&>*]:w-6 [&>*]:items-center [&>*]:justify-center [&>*]:rounded-full">
                        {i === room.dealer && (
                          <div className="bg-white text-gray-800">D</div>
                        )}
                        {i === (room.dealer + 1) % room.players.length && (
                          <div className="bg-blue-600 text-gray-800">SB</div>
                        )}
                        {i === (room.dealer + 2) % room.players.length && (
                          <div className="bg-yellow-600 text-gray-800">BB</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Table>
        {isAdmin && (
          <button
            className="absolute bottom-4 right-4 flex h-12 w-12 rounded-full bg-gray-800 p-3 text-white"
            onClick={() => socket.emit("startGame")}
          >
            <StepForward className="h-full w-full fill-white" />
          </button>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-4 bg-gray-800 p-4 text-xl text-gray-800 sm:!justify-center">
        <Button
          className="bg-green-400 hover:bg-green-500 active:bg-green-600"
          onClick={() => socket.emit("checkCall")}
        >
          CHECK
        </Button>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600"
          onClick={() => socket.emit("raise", 200)}
        >
          BET
        </Button>
        <Button
          className="bg-red-400 hover:bg-red-500 active:bg-red-600"
          onClick={() => socket.emit("fold")}
        >
          FOLD
        </Button>
      </div>
    </main>
  );
}
