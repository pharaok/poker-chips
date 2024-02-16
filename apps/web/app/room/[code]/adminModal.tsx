import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import { Room } from "@repo/utils/room";
import { useEffect, useState } from "react";
import { Label, NumberField } from "react-aria-components";
import { socket } from "../../socket";
import Button from "@repo/ui/button";
import { Ban, Shield } from "lucide-react";
import ToggleButton from "@repo/ui/toggleButton";

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
  const [admin, setAdmin] = useState(room.admin!.id);
  const [kicks, setKicks] = useState<string[]>([]);
  useEffect(() => {
    if (isOpen) {
      setStacks(room.players.map((p) => p.stack));
      setKicks([]);
      setAdmin(room.admin!.id);
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
            <div key={i} className="flex w-full items-center gap-2">
              <Label className="flex-1">{p.name}</Label>
              <NumberField
                aria-label={p.name}
                value={stacks[i]}
                onChange={(v) => {
                  setStacks((s) => {
                    const newStacks = s.slice();
                    newStacks[i] = v;
                    return newStacks;
                  });
                }}
              >
                <Input className="w-32" />
              </NumberField>
              <ToggleButton
                isDisabled={p.id === room.admin!.id || p.id === admin}
                isSelected={kicks.includes(p.id)}
                onPress={() => {
                  if (kicks.includes(p.id))
                    setKicks(kicks.filter((pId) => pId !== p.id));
                  else setKicks([...kicks, p.id]);
                }}
                className="h-10 w-10 p-2 data-[selected]:bg-red-500 data-[selected]:text-gray-800 data-[selected]:hover:!bg-red-600"
              >
                <Ban />
              </ToggleButton>
              <ToggleButton
                isSelected={p.id === admin}
                onPress={() => {
                  setAdmin(p.id);
                  if (kicks.includes(p.id))
                    setKicks(kicks.filter((pId) => pId !== p.id));
                }}
                className="h-10 w-10 p-2 data-[selected]:text-green-500 data-[selected]:hover:bg-gray-300"
              >
                <Shield className="fill-current" />
              </ToggleButton>
            </div>
          );
        })}
      </div>

      <Button
        kind="primary"
        onPress={() => {
          stacks.forEach((s, i) => {
            if (s !== room.players[i]?.stack)
              socket.emit("setStack", i, stacks[i]!);

            if (kicks) socket.emit("kickPlayers", kicks);
            if (admin !== room.admin?.id) socket.emit("setAdmin", admin);
          });
          setOpen(false);
        }}
      >
        CONFIRM
      </Button>
    </Modal>
  );
}
