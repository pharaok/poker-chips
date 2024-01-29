import { Player, Room } from "@repo/utils/room";

export default function Player({
  room,
  playerIndex,
}: {
  room: Room;
  playerIndex: number;
}) {
  const p = room.players[playerIndex]!;
  return (
    <div
      className={`flex flex-col items-center rounded-lg bg-gray-800/75 px-6 py-2 ${
        playerIndex === room.turn ? "border-4 border-white" : ""
      }`}
    >
      <div className="flex justify-between gap-2">
        <span className="text-lg">{p.name}</span>
      </div>
      <span className="text-2xl font-bold">{p.stack}</span>
      <div className="absolute -bottom-8 flex w-full gap-2 text-gray-800 [&>*]:flex [&>*]:h-6 [&>*]:w-6 [&>*]:items-center [&>*]:justify-center [&>*]:rounded-full">
        {playerIndex === room.dealer && <div className="bg-white">D</div>}
        {playerIndex === (room.dealer + 1) % room.players.length && (
          <div className="bg-blue-600">SB</div>
        )}
        {playerIndex === (room.dealer + 2) % room.players.length && (
          <div className="bg-yellow-600">BB</div>
        )}
      </div>
    </div>
  );
}
