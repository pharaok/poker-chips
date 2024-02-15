import Button from "@repo/ui/button";
import Input from "@repo/ui/input";
import Modal from "@repo/ui/modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { Rooms } from "@repo/utils";
import { User, Users } from "lucide-react";

export default function JoinRoomModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [rooms, setRooms] = useState<Rooms>([]);
  useEffect(() => {
    if (!isOpen) return;
    socket.emit("getRooms", (rs) => setRooms(rs));
  }, [isOpen]);
  return (
    <Modal
      isDismissable
      isOpen={isOpen}
      onOpenChange={setOpen}
      title="JOIN ROOM"
    >
      <div className="flex w-full flex-col items-center gap-4 px-6">
        <div className="w-full overflow-scroll">
          {rooms && (
            <table className="whitespace-nowrap text-center [&_td]:p-2 [&_th]:p-2">
              <thead>
                <th>NAME</th>
                <th>HOST</th>
                <th>PLAYERS</th>
                <th>BUY IN</th>
                <th>BLINDS</th>
              </thead>
              {rooms.map((room) => {
                return (
                  <tr
                    onClick={() => setRoomCode(room.code)}
                    className="cursor-pointer select-none transition-colors hover:bg-gray-800"
                  >
                    <td>{room.name}</td>
                    <td>{room.host}</td>
                    <td>
                      {room.playerCount}
                      {room.playerCount === 1 ? (
                        <User className="inline" />
                      ) : (
                        <Users className="inline" />
                      )}
                    </td>
                    <td>{room.buyIn.toLocaleString()}</td>
                    <td>{`${room.smallBlind.toLocaleString()}/${room.bigBlind.toLocaleString()}`}</td>
                  </tr>
                );
              })}
            </table>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="CODE"
            className="w-32"
          />
          <Button
            kind="primary"
            onPress={() => router.push(`/room/${roomCode}`)}
          >
            JOIN
          </Button>
        </div>
      </div>
    </Modal>
  );
}
