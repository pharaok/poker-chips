import Button from "@repo/ui/button";
import Modal from "@repo/ui/modal";
import ToggleButton from "@repo/ui/toggleButton";
import { Room } from "@repo/utils/room";
import { useState } from "react";
import { socket } from "../../socket";

export default function SelectWinnersModal({
  visible,
  room,
}: {
  visible: boolean;
  room: Room | null;
}) {
  const [winners, setWinners] = useState<number[]>([]);
  const pots = room && Room.prototype.generatePots.call(room);
  return (
    <Modal visible={visible} setVisible={() => null} title="CHOOSE WINNER">
      <div className="flex flex-col gap-2">
        {pots &&
          pots.map((pot, potIdx) => {
            return (
              <div
                key={potIdx}
                className="flex flex-col items-center justify-center gap-2"
              >
                <h2 className="text-lg">
                  {potIdx === 0 ? "MAIN POT" : `SIDE POT ${potIdx}`}
                </h2>
                <div className="flex flex-wrap gap-2">
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
          onPress={() => {
            socket.emit("selectWinners", winners);
          }}
        >
          CONFIRM
        </Button>
      </div>
    </Modal>
  );
}
