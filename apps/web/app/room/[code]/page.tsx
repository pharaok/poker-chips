"use client";

import Button from "@repo/ui/button";
import Card from "@repo/ui/card";
import Table from "@repo/ui/table";
import Tooltip from "@repo/ui/tooltip";
import { Room } from "@repo/utils/room";
import {
  ArrowUpFromLine,
  Info,
  LogOut,
  Menu,
  Plus,
  StepForward,
} from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TooltipTrigger } from "react-aria-components";
import { socket } from "../../socket";
import AdminModal from "./adminModal";
import BettingModal from "./bettingModal";
import HandRankingsModal from "./handRankingsModal";
import Player from "./player";
import SelectWinnersModal from "./selectWinnersModal";

export default function Page({ params }: { params: { code: string } }) {
  const router = useRouter();

  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const playerIndex = room?.players.findIndex((p) => p.id === socket.id);

  const player =
    playerIndex !== undefined ? room!.players[playerIndex] : undefined;
  const isAdmin = player?.id === room?.admin?.id;
  const callAmount = room && player ? room.roundBet - player.roundBet : 0;
  const lastCallAmount = useRef(0); // display during tooltip out animation
  if (callAmount > 0) lastCallAmount.current = callAmount;

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isHandsModalOpen, setIsHandsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isCpTooltipOpen, setIsCpTooltipOpen] = useState(false);

  const isDisabled =
    room?.phase === 0 || room?.phase === 5 || room?.turn?.id !== player?.id;

  useEffect(() => {
    socket.emit(
      "joinRoom",
      localStorage.getItem("name") || "Player",
      params.code,
      (room) => setRoom(room),
    );
    socket.on("updateRoom", (room) => {
      setRoom(room);
    });
    return () => {
      // HACK:
      socket.disconnect();
      socket.connect();
      socket.off("updateRoom");
    };
  }, []);

  if (room && playerIndex === -1) router.push("/"); // kicked
  if (room === null) notFound();

  return (
    <main className="min-w-screen flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex w-full flex-grow items-center justify-center">
        <TooltipTrigger isOpen={isCpTooltipOpen}>
          <Tooltip
            placement="bottom"
            triggerRef={buttonRef}
            className="text-2xl"
          >
            Copied to clipboard!
          </Tooltip>
          <button
            ref={buttonRef}
            className="absolute left-4 top-4 z-10 text-2xl text-white"
            disabled={!navigator.clipboard}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setIsCpTooltipOpen(true);
              setTimeout(() => setIsCpTooltipOpen(false), 3000);
            }}
          >{`#${params.code}`}</button>
        </TooltipTrigger>

        <Table
          around={
            room &&
            player &&
            playerIndex !== undefined &&
            room?.players.reduce((s, p) => s + +p.isPlaying, 0)
              ? room?.players.reduce((cs, _, i, a) => {
                  i = (i + playerIndex) % a.length;
                  const p = a[i]!;
                  if (!p.isPlaying) return cs;

                  if (!player.isPlaying) {
                    cs.push(
                      <Button
                        className="flex h-12 w-12 items-center justify-center p-3 text-white"
                        onPress={() => socket.emit("sitDownAt", i)}
                      >
                        <Plus className="h-full w-full" />
                      </Button>,
                    );
                  }
                  cs.push(<Player key={i} room={room} playerIndex={i} />);
                  return cs;
                }, [] as React.ReactNode[])
              : [
                  <Button
                    className="flex h-12 w-12 items-center justify-center p-3 text-white"
                    onPress={() => socket.emit("sitDownAt", 0)}
                  >
                    <Plus className="h-full w-full" />
                  </Button>,
                ]
          }
        >
          <div className="flex w-full flex-col items-center gap-1 px-6 md:top-0">
            <span className="text-xl">
              {room &&
                ["PREGAME", "PREFLOP", "FLOP", "TURN", "RIVER", "POSTGAME"][
                  room.phase
                ]}
            </span>
            <div className="flex w-full justify-center gap-2 md:w-auto">
              {room &&
                [...Array(5)].map((_, i) => {
                  let visible = false;
                  if (
                    (i < 3 && room.phase > 1) ||
                    (i === 3 && room.phase > 2) ||
                    (i === 4 && room.phase > 3)
                  ) {
                    visible = true;
                  }
                  return (
                    <div
                      key={i}
                      // HACK: !important
                      className={`w-full rounded-md border-2 border-green-400 transition-[border-color] md:!w-auto`}
                    >
                      <Card
                        faceDown
                        className={`h-auto w-full transition-opacity duration-150 md:h-20 md:!w-auto ${
                          visible ? "" : "opacity-0"
                        }`}
                        style={{
                          transitionDelay:
                            room.phase < 3
                              ? (i * 150).toString() + "ms"
                              : "0ms",
                        }}
                      />
                    </div>
                  );
                })}
            </div>
            <span className="text-3xl">{room?.pot.toLocaleString()}</span>
          </div>
        </Table>
        <div className="absolute right-4 top-4 flex flex-col gap-2 text-white">
          <Button
            className="flex h-12 w-12 p-3"
            isDisabled={(room && !player?.isFolded && room?.phase > 0) ?? false}
            onPress={() => {
              if (player?.isPlaying) socket.emit("getUp");
              else {
                socket.emit("leaveRoom");
                router.push("/");
              }
            }}
          >
            {player?.isPlaying ? (
              <ArrowUpFromLine className="h-full w-full" />
            ) : (
              <LogOut className="h-full w-full" />
            )}
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
          <Tooltip>{lastCallAmount.current.toLocaleString()}</Tooltip>
          <Button
            className="w-28 bg-green-400 enabled:hover:!bg-green-500 disabled:bg-green-800 disabled:text-gray-800"
            isDisabled={isDisabled}
            onPress={() => socket.emit("checkCall")}
          >
            {callAmount > 0 ? "CALL" : "CHECK"}
          </Button>
        </TooltipTrigger>
        <Button
          className="w-28 bg-yellow-400 enabled:hover:!bg-yellow-500 disabled:bg-yellow-800 disabled:text-gray-800"
          isDisabled={isDisabled}
          onPress={() => setIsBetModalOpen(true)}
        >
          {callAmount > 0 ? "RAISE" : "BET"}
        </Button>
        <Button
          className="w-28 bg-red-400 enabled:hover:!bg-red-500 disabled:bg-red-800 disabled:text-gray-800"
          isDisabled={isDisabled}
          onPress={() => socket.emit("fold")}
        >
          FOLD
        </Button>
      </div>
      <BettingModal
        room={room ?? null}
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
