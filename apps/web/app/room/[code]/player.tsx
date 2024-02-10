import { formatNumberKMB } from "@repo/utils";
import { Player, Room } from "@repo/utils/room";
import { Crown, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Player({
  room,
  playerIndex,
}: {
  room: Room;
  playerIndex: number;
}) {
  const player = room.players[playerIndex]!;
  const nextPlayer = (p: Player) => Room.prototype.nextPlayer.call(room, p);

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [bBox, setBBox] = useState(new DOMRect());
  const pathLength = pathRef.current?.getTotalLength() ?? 0;

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!svgRef.current) return;
      setBBox(svgRef.current.getBoundingClientRect());
    });
    observer.observe(svgRef.current!);

    return () => observer.disconnect();
  }, [svgRef, pathRef]);

  let popupClassName;
  switch (player.lastAction?.kind) {
    case "check":
    case "call":
      popupClassName = "text-gray-800 before:shadow-green-400";
      break;
    case "all in":
    case "bet":
    case "raise":
      popupClassName = "text-gray-800 before:shadow-yellow-400";
      break;
    case "fold":
      popupClassName = "text-gray-800 before:shadow-red-400";
      break;
    case "small blind":
    case "big blind":
      popupClassName = "text-gray-800 before:shadow-blue-400";
      break;
    default:
      popupClassName = "before:shadow-gray-800";
      break;
  }
  return (
    <div className="text-xl">
      <div
        className={`pointer-events-none absolute w-full -translate-y-[100%] text-center before:absolute before:inset-x-0 before:-bottom-16 before:-z-10 before:h-16 before:rounded-t-lg before:transition-[box-shadow] ${
          player.lastAction
            ? "before:shadow-[0_-32px_0_0_var(--tw-shadow-color)]"
            : "before:shadow-[0_0_0_0_var(--tw-shadow-color)]"
        } ${popupClassName}`}
      >
        <div className="overflow-hidden">
          <div
            className={`rounded-t-lg transition-[transform] ${
              player.lastAction ? "translate-y-0" : "translate-y-[100%]"
            }`}
          >
            {player.lastAction
              ? player.lastAction.kind.toUpperCase() +
                (player.lastAction.kind === "bet" ||
                player.lastAction.kind === "raise"
                  ? " " + formatNumberKMB(player.lastAction.amount)
                  : "")
              : ""}
          </div>
        </div>
      </div>
      <div
        className={`relative z-10 flex flex-col items-center px-8 py-2 transition-colors ${
          player.isFolded || player.isDisconnected ? "text-white/25" : ""
        }`}
      >
        <div className="flex justify-between gap-2">
          <span>{player.name}</span>
        </div>
        <span className="text-2xl font-bold">
          {player.stack.toLocaleString()}
        </span>
        <div className="absolute -bottom-8 flex w-full gap-2 text-base text-gray-800 [&>*]:flex [&>*]:h-6 [&>*]:w-6 [&>*]:items-center [&>*]:justify-center">
          {player.id === room.admin?.id && (
            <Shield className="fill-green-600 text-white" />
          )}
          {player.id === room.dealer?.id && (
            <div className="rounded-full bg-white">D</div>
          )}
          {player.id === nextPlayer(room.dealer!).id && (
            <div className="rounded-full bg-blue-600">SB</div>
          )}
          {player.id === nextPlayer(nextPlayer(room.dealer!)).id && (
            <div className="rounded-full bg-yellow-600">BB</div>
          )}
          {player.id === room?.lastWinner?.id && (
            <Crown className="!rounded-none fill-current text-yellow-400" />
          )}
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* HACK: double stroke width inset stroke hack*/}
        <svg ref={svgRef} className="h-full w-full">
          <path
            ref={pathRef}
            d={`M ${bBox.width / 2} 0 
                  L ${bBox.width - 8} 0
                  a 8 8 0 0 1 8 8
                  L ${bBox.width} ${bBox.height - 8}
                  a 8 8 0 0 1 -8 8
                  L 8 ${bBox.height}
                  a 8 8 0 0 1 -8 -8
                  L 0 8
                  a 8 8 0 0 1 8 -8
                  Z`}
            strokeWidth={8}
            strokeDashoffset={pathLength * +player.isDisconnected}
            strokeDasharray={pathLength}
            className={`fill-gray-800/75 ${
              player.isDisconnected
                ? "stroke-red-400"
                : room.turn!.id === player.id
                  ? "stroke-white"
                  : "stroke-transparent"
            } transition-[stroke-dashoffset,stroke] ${
              player.isDisconnected ? "duration-[30s,300ms]" : ""
            } ease-linear`}
          ></path>
        </svg>
      </div>
    </div>
  );
}
