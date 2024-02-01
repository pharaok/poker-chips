import Button from "@repo/ui/button";
import Modal from "@repo/ui/modal";
import ToggleButton from "@repo/ui/toggleButton";
import { Room } from "@repo/utils/room";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function SelectWinnersModal({
  isOpen,
  room,
}: {
  isOpen: boolean;
  room: Room | null;
}) {
  const [winners, setWinners] = useState<(number | null)[]>([]);
  const pots = room && Room.prototype.generatePots.call(room);
  useEffect(() => {
    if (room?.phase === 5) {
      const nextWinners: (number | null)[] = Array.from(pots!, () => null);
      pots?.forEach((pot, i) => {
        if (pot.players.length === 1) {
          nextWinners[i] = pot.players[0]!;
        }
      });
      setWinners(nextWinners);
    }
  }, [room]);

  return (
    <Modal isOpen={isOpen} title="SELECT WINNER">
      <div className="flex flex-col gap-2">
        {pots &&
          pots.map((pot, potIdx) => {
            if (pot.players.length === 1) return null;
            return (
              <div
                key={potIdx}
                className="flex flex-col items-center justify-center gap-2"
              >
                <h2 className="text-lg">
                  {`${potIdx === 0 ? "MAIN POT" : `SIDE POT ${potIdx}`} (${
                    pot.contribPerPlayer * pot.players.length
                  })`}
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {pot.players.map((playerIdx, j) => (
                    <ToggleButton
                      key={j}
                      isSelected={playerIdx === winners[potIdx]}
                      onPress={() => {
                        setWinners((w) => {
                          const nextWinners = w.slice();
                          nextWinners[potIdx] = playerIdx;
                          return nextWinners;
                        });
                      }}
                    >
                      {room.players[playerIdx]!.name}
                    </ToggleButton>
                  ))}
                </div>
              </div>
            );
          })}
        <Button
          isDisabled={!winners.every((w) => typeof w === "number")}
          className="text-gray-800 hover:!bg-gray-300 disabled:bg-gray-600"
          onPress={() => {
            socket.emit("selectWinners", winners as number[]);
          }}
        >
          CONFIRM
        </Button>
      </div>
    </Modal>
  );
}
