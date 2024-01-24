import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import { Room } from "@repo/utils/room";
import { Fragment, useEffect, useState } from "react";
import { NumberField } from "react-aria-components";
import { socket } from "../../socket";
import Button from "@repo/ui/button";

export default function AdminModal({
  room,
  visible,
  setVisible,
}: {
  room: Room;
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  const [stacks, setStacks] = useState(room.players.map((p) => p.stack));
  useEffect(() => {
    if (!visible) {
      setStacks(room.players.map((p) => p.stack));
    }
  }, [room, visible]);

  return (
    <Modal visible={visible} setVisible={setVisible} title="ADMIN MENU">
      <div className="grid grid-cols-2 gap-2 px-6">
        {room?.players.map((p, i) => {
          return (
            <Fragment key={i}>
              <span>{p.name}</span>
              <NumberField
                value={stacks[i]}
                onChange={(v) => {
                  setStacks((s) => {
                    const newStacks = s.slice();
                    newStacks[i] = v;
                    return newStacks;
                  });
                }}
              >
                <Input className="w-full" />
              </NumberField>
            </Fragment>
          );
        })}
      </div>
      <Button
        className="col-span-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
        onPress={() => {
          setVisible(false);
          stacks.forEach((s, i) => {
            if (s !== room.players[i]?.stack) {
              socket.emit("setStack", i, stacks[i]!);
            }
          });
        }}
      >
        CONFIRM
      </Button>
    </Modal>
  );
}
