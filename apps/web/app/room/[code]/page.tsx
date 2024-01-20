"use client";

import Table from "@repo/ui/table";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { Player } from "../../../../server/src/types";

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

  // HACK: at least it works
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

export default function Room({ params }: { params: { code: string } }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit(
      "joinRoom",
      localStorage.getItem("name") || "Player",
      params.code,
      (players) => {
        setPlayers(players);
      },
    );
    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });
    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div ref={tableRef} className="relative -m-12 h-full w-full">
          {players.map((p, i, a) => {
            if (tableRef.current === null) {
              return;
            }
            const { clientWidth, clientHeight } = tableRef.current!;

            const [x, y] = getPointOnPill(
              clientWidth,
              clientHeight,
              i / a.length,
            );
            return (
              <div
                key={i}
                className={`absolute flex -translate-x-[50%] -translate-y-[50%] flex-col items-center rounded-xl bg-gray-800/75 px-6 py-2 text-white ${
                  i === 0 ? "border-8 border-white" : ""
                }`}
                style={{
                  left: x,
                  top: y,
                }}
              >
                <span className="text-lg">{p.name}</span>
                <span className="text-2xl font-bold">{p.stack}</span>
              </div>
            );
          })}
        </div>
      </Table>
    </main>
  );
}
