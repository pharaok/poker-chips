import { Socket as SocketIO } from "socket.io";
import { Room } from "./room";

export interface ClientToServerEvents {
  createRoom: (callback: (id: string) => void) => void;
  joinRoom: (name: string, id: string, callback: (room: Room) => void) => void;
  leaveRoom: () => void;
  startGame: () => void;
  checkCall: () => void;
  raise: (amount: number) => void;
  fold: () => void;
  selectWinners: (ps: number[]) => void;
  setStack: (p: number, stack: number) => void;
}
export interface ServerToClientEvents {
  updateRoom: (room: Room) => void;
}

export type Socket = SocketIO<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  {}
>;

export const getPointOnPill = (
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
