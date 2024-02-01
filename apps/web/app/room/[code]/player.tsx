import { formatNumberKMB } from "@repo/utils";
import { Player, Room } from "@repo/utils/room";
import { Crown, Shield } from "lucide-react";

export default function Player({
  room,
  playerIndex,
}: {
  room: Room;
  playerIndex: number;
}) {
  const p = room.players[playerIndex]!;
  const nextPlayer = (p: Player) => Room.prototype.nextPlayer.call(room, p);

  let popupClassName;
  switch (p.lastAction?.kind) {
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
          p.lastAction
            ? "before:shadow-[0_-32px_0_0_var(--tw-shadow-color)]"
            : "before:shadow-[0_0_0_0_var(--tw-shadow-color)]"
        } ${popupClassName}`}
      >
        <div className="overflow-hidden">
          <div
            className={`rounded-t-lg transition-[transform] ${
              p.lastAction ? "translate-y-0" : "translate-y-[100%]"
            }`}
          >
            {p.lastAction
              ? p.lastAction.kind.toUpperCase() +
                (p.lastAction.kind === "bet" || p.lastAction.kind === "raise"
                  ? " " + formatNumberKMB(p.lastAction.amount)
                  : "")
              : ""}
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col items-center rounded-lg bg-gray-800/75 px-8 py-2 ${
          p.id === room.turn?.id ? "border-4 border-white" : ""
        } ${p.isFolded ? "text-white/25" : ""}`}
      >
        <div className="flex justify-between gap-2">
          <span>{p.name}</span>
        </div>
        <span className="text-2xl font-bold">{p.stack.toLocaleString()}</span>
        <div className="absolute -bottom-8 flex w-full gap-2 text-base text-gray-800 [&>*]:flex [&>*]:h-6 [&>*]:w-6 [&>*]:items-center [&>*]:justify-center">
          {p.id === room.admin?.id && (
            <Shield className="fill-green-600 text-white" />
          )}
          {p.id === room.dealer?.id && (
            <div className="rounded-full bg-white">D</div>
          )}
          {p.id === nextPlayer(nextPlayer(room.dealer!)).id && (
            <div className="rounded-full bg-blue-600">SB</div>
          )}
          {p.id === nextPlayer(room.dealer!).id && (
            <div className="rounded-full bg-yellow-600">BB</div>
          )}
          {p.id === room?.lastWinner?.id && (
            <Crown className="!rounded-none fill-current text-yellow-400" />
          )}
        </div>
      </div>
    </div>
  );
}
