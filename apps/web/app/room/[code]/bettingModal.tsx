import Button from "@repo/ui/button";
import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import Slider from "@repo/ui/slider";
import { Room } from "@repo/utils/room";
import { useEffect, useRef, useState } from "react";
import { NumberField } from "react-aria-components";
import { socket } from "../../socket";

export default function BettingModal({
  room,
  isOpen,
  setOpen,
}: {
  room: Room | null;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [betAmount, setBetAmount] = useState(0);
  const j = room?.players.findIndex((p) => p.id === socket.id);

  const callAmount =
    (room && room!.roundBet - room!.players[j!]!.roundBet) || 0;
  const minBet = (room && Math.max(room.roundBet, room.bigBlind)) || 0;
  const maxBet = (j !== undefined && room!.players[j]!.stack - callAmount) || 0;

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) setBetAmount(minBet);
  }, [isOpen]);

  return (
    <Modal isDismissable isOpen={isOpen} onOpenChange={setOpen} title="BET">
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          value={betAmount}
          onChange={setBetAmount}
          className="col-span-full"
          minValue={minBet}
          maxValue={maxBet}
          aria-label="bet input"
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
          aria-label="bet slider"
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
              Math.floor((2 * room!.pot) / 3 / room!.bigBlind) * room!.bigBlind,
            );
          }}
        >
          2/3
        </Button>
        <Button onPress={() => setBetAmount(Math.floor(room!.pot))}>POT</Button>
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
          className="col-span-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
          onPress={() => {
            setOpen(false);
            socket.emit("raise", betAmount);
          }}
        >
          CONFIRM
        </Button>
      </div>
    </Modal>
  );
}
