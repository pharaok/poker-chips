import Modal from "@repo/ui/modal";
import { socket } from "./socket";
import Button from "@repo/ui/button";
import Input from "@repo/ui/input";
import { Label, NumberField } from "react-aria-components";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGameModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [buyIn, setBuyIn] = useState(10000);
  const [smallBlind, setSmallBlind] = useState(100);
  const [bigBlind, setBigBlind] = useState(200);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setOpen}
      isDismissable
      title="CREATE GAME"
    >
      <div className="flex flex-col items-center gap-2 px-6 [&>div]:grid [&>div]:grid-cols-2 [&>div]:items-center [&>div]:gap-2 [&_input]:w-32">
        <NumberField value={buyIn} onChange={setBuyIn}>
          <Label>BUY IN</Label>
          <Input />
        </NumberField>
        <NumberField value={smallBlind} onChange={setSmallBlind}>
          <Label>SMALL BLIND</Label>
          <Input />
        </NumberField>
        <NumberField value={bigBlind} onChange={setBigBlind}>
          <Label>BIG BLIND</Label>
          <Input />
        </NumberField>
        <Button
          kind="primary"
          className="col-span-2"
          onPress={() =>
            socket.emit("createRoom", buyIn, smallBlind, bigBlind, (code) =>
              router.push(`/room/${code}`),
            )
          }
        >
          CONFIRM
        </Button>
      </div>
    </Modal>
  );
}
