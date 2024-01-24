"use client";

import Button from "@repo/ui/button";
import Table from "@repo/ui/table";
import Tooltip from "@repo/ui/tooltip";
import { getPointOnPill } from "@repo/utils";
import { Room } from "@repo/utils/room";
import { StepForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TooltipTrigger } from "react-aria-components";
import { socket } from "../../socket";
import SelectWinnersModal from "./selectWinnersModal";
import BettingModal from "./bettingModal";

export default function Page({ params }: { params: { code: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const j = room?.players.findIndex((p) => p.id === socket.id);

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const callAmount =
    (room && room!.roundBet - room!.players[j!]!.roundBet) || 0;

  const isDisabled = room?.phase === 0 || room?.phase === 5 || room?.turn !== j;

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
                <span className="text-xl text-white">
                  {
                    ["PREGAME", "PREFLOP", "FLOP", "TURN", "RIVER", "POSTGAME"][
                      room.phase
                    ]
                  }
                </span>
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
          <Button
            className="absolute bottom-4 right-4 flex h-12 w-12 rounded-full bg-gray-800 p-3 text-white"
            onPress={() => socket.emit("startGame")}
          >
            <StepForward className="h-full w-full fill-white" />
          </Button>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-4 bg-gray-800 p-4 text-xl text-gray-800 sm:!justify-center">
        <TooltipTrigger isOpen={callAmount > 0}>
          <Tooltip>{callAmount}</Tooltip>
          <Button
            className="w-28 bg-green-400 hover:bg-green-500 disabled:bg-green-800"
            isDisabled={isDisabled}
            onPress={() => socket.emit("checkCall")}
          >
            {callAmount > 0 ? "CALL" : "CHECK"}
          </Button>
        </TooltipTrigger>
        <Button
          className="w-28 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-800"
          isDisabled={isDisabled}
          onPress={() => {
            setIsBetModalOpen(true);
          }}
        >
          {callAmount > 0 ? "RAISE" : "BET"}
        </Button>
        <Button
          className="w-28 bg-red-400 hover:bg-red-500 disabled:bg-red-800"
          isDisabled={isDisabled}
          onPress={() => socket.emit("fold")}
        >
          FOLD
        </Button>
      </div>
      <BettingModal
        room={room}
        visible={isBetModalOpen}
        setVisible={setIsBetModalOpen}
      ></BettingModal>
      <SelectWinnersModal
        visible={j === 0 && room?.phase === 5}
        room={room!}
      ></SelectWinnersModal>
    </main>
  );
}
