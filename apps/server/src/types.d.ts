export interface ClientToServerEvents {
  createRoom: (callback: (id: string) => void) => void;
  joinRoom: (id: string) => void;
}
export interface ServerToClientEvents {}
