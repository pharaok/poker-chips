"use client";

import Button from "@repo/ui/button";
import Table from "@repo/ui/table";
import Tooltip from "@repo/ui/tooltip";
import { Room } from "@repo/utils/room";
import { ArrowUpFromLine, Info, Menu, Plus, StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import { TooltipTrigger } from "react-aria-components";
import { socket } from "../../socket";
import AdminModal from "./adminModal";
import BettingModal from "./bettingModal";
import SelectWinnersModal from "./selectWinnersModal";
import Player from "./player";
import HandRankingsModal from "./handRankingsModal";

export default function Page({ params }: { params: { code: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const playerIndex = room?.players.findIndex((p) => p.id === socket.id);

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const callAmount =
    (room && room!.roundBet - room!.players[playerIndex!]!.roundBet) || 0;

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isHandsModalOpen, setIsHandsModalOpen] = useState(false);

  const isDisabled =
    room?.phase === 0 || room?.phase === 5 || room?.turn !== playerIndex;

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
      <h2 className="fixed left-4 top-4 text-2xl text-white">{`#${params.code}`}</h2>
      <div className="relative flex w-full flex-grow items-center justify-center">
        <Table
          around={room?.players.reduce((cs, _, i, a) => {
            i = (i + playerIndex!) % a.length;
            const p = a[i]!;
            if (!p.isPlaying) return cs;

            cs.push(<Player key={i} room={room} playerIndex={i} />);
            if (!room.players[playerIndex!]!.isPlaying) {
              cs.push(
                <Button
                  className="flex h-12 w-12 items-center justify-center p-3 text-white"
                  onPress={() => socket.emit("sitDownAt", i + 1)}
                >
                  <Plus className="h-full w-full" />
                </Button>,
              );
            }
            return cs;
          }, [] as React.ReactNode[])}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl">
              {room &&
                ["PREGAME", "PREFLOP", "FLOP", "TURN", "RIVER", "POSTGAME"][
                  room.phase
                ]}
            </span>
            <span className="text-3xl">{room?.pot.toLocaleString()}</span>
          </div>
        </Table>
        <div className="absolute right-4 top-4 flex flex-col gap-2 text-white">
          <Button
            className="flex h-12 w-12 p-3"
            onPress={() => socket.emit("getUp")}
          >
            <ArrowUpFromLine className="h-full w-full" />
          </Button>
          <Button
            className="flex h-12 w-12 p-3"
            onPress={() => setIsHandsModalOpen(true)}
          >
            <Info className="h-full w-full" />
          </Button>
        </div>

        {isAdmin && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 text-white">
            <Button
              className="flex h-12 w-12 p-3"
              onPress={() => setIsAdminModalOpen(true)}
            >
              <Menu className="h-full w-full" />
            </Button>
            <Button
              className="flex h-12 w-12 p-3"
              onPress={() => socket.emit("startGame")}
            >
              <StepForward className="h-full w-full fill-current" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-between gap-4 bg-gray-800 p-4 text-xl text-gray-800 sm:!justify-center">
        <TooltipTrigger isOpen={callAmount > 0}>
          <Tooltip>{callAmount.toLocaleString()}</Tooltip>
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
        isOpen={isBetModalOpen}
        setOpen={setIsBetModalOpen}
      ></BettingModal>
      <SelectWinnersModal
        isOpen={playerIndex === 0 && room?.phase === 5}
        room={room!}
      ></SelectWinnersModal>
      {room && (
        <AdminModal
          room={room}
          isOpen={isAdminModalOpen}
          setOpen={setIsAdminModalOpen}
        ></AdminModal>
      )}
      <HandRankingsModal
        isOpen={isHandsModalOpen}
        setOpen={setIsHandsModalOpen}
      ></HandRankingsModal>
    </main>
  );
}
