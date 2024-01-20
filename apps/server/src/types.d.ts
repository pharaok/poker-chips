export interface ClientToServerEvents {
  createRoom: (callback: (id: string) => void) => void;
  joinRoom: (
    name: string,
    id: string,
    callback: (players: Player[]) => void,
  ) => void;
}
export interface ServerToClientEvents {
  updatePlayers: (players: Player[]) => void;
}

interface Player {
  id: string;
  name: string;
  stack: number;
}
