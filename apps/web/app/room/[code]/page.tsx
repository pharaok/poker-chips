"use client";

import Button from "@repo/ui/button";
import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import Slider from "@repo/ui/slider";
import Table from "@repo/ui/table";
import Tooltip from "@repo/ui/tooltip";
import { StepForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NumberField, TooltipTrigger } from "react-aria-components";
import { Room } from "@repo/utils/room";
import { socket } from "../../socket";
import { getPointOnPill } from "@repo/utils";
import SelectWinnersModal from "./selectWinnersModal";

export default function Page({ params }: { params: { code: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const j = room?.players.findIndex((p) => p.id === socket.id);

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const callAmount =
    (room && room!.roundBet - room!.players[j!]!.roundBet) || 0;
  const minBet = (room && Math.max(room.roundBet, room.bigBlind)) || 0;
  const maxBet = (j !== undefined && room!.players[j]!.stack - callAmount) || 0;

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
            setBetAmount(minBet);
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
      <Modal
        visible={isBetModalOpen}
        setVisible={setIsBetModalOpen}
        title="BET"
      >
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            value={betAmount}
            onChange={setBetAmount}
            className="col-span-full"
            minValue={minBet}
            maxValue={maxBet}
          >
            <Input className="col-span-full" />
          </NumberField>
          <Slider
            value={betAmount}
            onChange={setBetAmount}
            className="col-span-full my-2"
            step={room?.bigBlind || 1}
            minValue={minBet}
            maxValue={maxBet}
          />
          <Button
            onPressStart={() => {
              setBetAmount((b) => b - room!.bigBlind);
              holdTimeoutRef.current = setTimeout(() => {
                holdIntervalRef.current = setInterval(() => {
                  setBetAmount((b) =>
                    Math.max(minBet, Math.min(b - room!.bigBlind, maxBet)),
                  );
                }, 50);
              }, 300);
            }}
            onPressEnd={() => {
              clearTimeout(holdTimeoutRef.current!);
              clearInterval(holdIntervalRef.current!);
              holdTimeoutRef.current = null;
              holdIntervalRef.current = null;
            }}
          >
            -BIG
          </Button>
          <Button
            onPressStart={() => {
              setBetAmount((b) => b + room!.bigBlind);
              holdTimeoutRef.current = setTimeout(() => {
                holdIntervalRef.current = setInterval(() => {
                  setBetAmount((b) =>
                    Math.max(minBet, Math.min(b + room!.bigBlind, maxBet)),
                  );
                }, 50);
              }, 300);
            }}
            onPressEnd={() => {
              clearTimeout(holdTimeoutRef.current!);
              clearInterval(holdIntervalRef.current!);
              holdTimeoutRef.current = null;
              holdIntervalRef.current = null;
            }}
          >
            +BIG
          </Button>

          <Button
            onPress={() => {
              setBetAmount(
                Math.floor(room!.pot / 3 / room!.bigBlind) * room!.bigBlind,
              );
            }}
          >
            1/3
          </Button>
          <Button
            onPress={() => {
              setBetAmount(
                Math.floor(room!.pot / 2 / room!.bigBlind) * room!.bigBlind,
              );
            }}
          >
            1/2
          </Button>
          <Button
            onPress={() => {
              setBetAmount(
                Math.floor((2 * room!.pot) / 3 / room!.bigBlind) *
                  room!.bigBlind,
              );
            }}
          >
            2/3
          </Button>
          <Button onPress={() => setBetAmount(Math.floor(room!.pot))}>
            POT
          </Button>
          <Button
            onPress={() =>
              setBetAmount(
                room!.players[j!]!.stack -
                  (room!.roundBet - room!.players[j!]!.roundBet),
              )
            }
            className="col-span-full"
          >
            ALL IN
          </Button>
          <div className="col-span-full m-1 h-px bg-gray-600"></div>
          <Button
            className="col-span-2 bg-gray-200 text-gray-800 hover:bg-gray-400"
            onPress={() => {
              console.log("raising", betAmount);
              setIsBetModalOpen(false);
              socket.emit("raise", betAmount);
            }}
          >
            CONFIRM
          </Button>
        </div>
      </Modal>
      <SelectWinnersModal
        visible={j === 0 && room?.phase === 5}
        room={room!}
      ></SelectWinnersModal>
    </main>
  );
}
