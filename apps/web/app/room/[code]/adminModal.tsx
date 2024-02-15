import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import { Room } from "@repo/utils/room";
import { Fragment, useEffect, useState } from "react";
import { Label, NumberField } from "react-aria-components";
import { socket } from "../../socket";
import Button from "@repo/ui/button";

export default function AdminModal({
  room,
  isOpen,
  setOpen,
}: {
  room: Room;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [stacks, setStacks] = useState(room.players.map((p) => p.stack));
  useEffect(() => {
    if (!isOpen) {
      setStacks(room.players.map((p) => p.stack));
    }
  }, [room, isOpen]);

  return (
    <Modal
      isDismissable
      isOpen={isOpen}
      onOpenChange={setOpen}
      title="ADMIN MENU"
    >
      <div className="flex flex-col gap-2 px-6">
        {room?.players.map((p, i) => {
          return (
            <Fragment key={i}>
              <NumberField
                value={stacks[i]}
                onChange={(v) => {
                  setStacks((s) => {
                    const newStacks = s.slice();
                    newStacks[i] = v;
                    return newStacks;
                  });
                }}
                className="grid grid-cols-2 items-center gap-2"
              >
                <Label>{p.name}</Label>
                <Input className="w-32" />
              </NumberField>
            </Fragment>
          );
        })}
      </div>
      <Button
        kind="primary"
        onPress={() => {
          setOpen(false);
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
