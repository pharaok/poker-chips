"use client";

import Table from "@repo/ui/table";
import { useEffect, useRef, useState } from "react";

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
  console.log(isPortrait);
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

export default function Room() {
  const [players, setPlayers] = useState<number[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setPlayers([...Array(7).keys()]);
  }, []);

  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center p-4">
      <Table>
        <div ref={tableRef} className="relative -m-12 h-full w-full">
          {players.map((n, i, a) => {
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
                className="absolute h-4 w-4 -translate-x-[50%] -translate-y-[50%] rounded-full bg-red-600"
                style={{
                  left: x,
                  top: y,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </Table>
    </main>
  );
}
