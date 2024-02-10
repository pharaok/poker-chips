type Action =
  | { kind: "call" }
  | { kind: "check" }
  | { kind: "bet"; amount: number }
  | { kind: "raise"; amount: number }
  | { kind: "fold" }
  | { kind: "all in" }
  | { kind: "small blind" }
  | { kind: "big blind" };

export interface Player {
  id: string;
  name: string;
  stack: number;
  roundBet: number;
  potContribution: number;
  isFolded: boolean;
  isPlaying: boolean;
  isDisconnected: boolean;
  lastAction: Action | null;
}

export class Room {
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
  phase: number;
  pot: number;
  roundBet: number;
  turn: Player | null;
  dealer: Player | null;
  lastBetter: Player | null;
  players: Player[];
  admin: Player | null;
  lastWinner: Player | null;

  constructor() {
    this.buyIn = 10000;
    this.smallBlind = 100;
    this.bigBlind = 200;
    this.phase = 0;
    this.pot = 0;
    this.roundBet = 0;
    this.turn = null;
    this.dealer = null;
    this.lastBetter = null;
    this.players = [];
    this.admin = null;
    this.lastWinner = null;
  }

  joinTable(player: Player) {
    this.players.push(player);
    if (this.players.length === 1) {
      this.admin = player;
      this.dealer = player;
      this.turn = player;
    }

    this.sitDownAt(player.id, this.players.length - 1);
  }
  leaveTable(id: string) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    const player = this.players[playerIndex]!;
    const isAdmin = player.id === this.admin!.id;

    if (this.phase !== 0) {
      player.isFolded = true;
      this.checkForFoldWin();
    }

    this.players.splice(playerIndex, 1);
    if (isAdmin) this.admin = this.players[0] ?? null;
    if (player.id === this.turn?.id) this.advanceTurn();
  }

  sitDownAt(id: string, at: number) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    const player = this.players[playerIndex]!;
    player.isPlaying = true;
    if (this.phase !== 0) player.isFolded = true;
    if (player.stack === 0) player.stack = this.buyIn; // re buy in

    this.players.splice(at, 0, this.players.splice(playerIndex, 1)[0]!);
  }
  getUp(id: string) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    const player = this.players[playerIndex]!;
    if (!player.isFolded && this.phase > 0) return;
    player.isPlaying = false;
    if (player.id === this.dealer!.id)
      this.dealer = this.nextPlayer(this.dealer!);
  }

  nextPlayer(player: Player) {
    const i = this.players.findIndex((p) => p.id === player.id);
    if (i === -1) return player;
    let j = i;
    do {
      j += 1;
      j %= this.players.length;
    } while (j !== i && !this.players[j]!.isPlaying);
    return this.players[j]!;
  }

  startGame() {
    if (this.players.filter((p) => p.isPlaying).length < 2) return;
    if (this.phase !== 0) return;
    this.phase += 1;

    this.advanceTurn();
    this.callRaise(this.smallBlind);
    this.turn!.lastAction = { kind: "small blind" };
    this.advanceTurn();
    this.callRaise(this.bigBlind - this.smallBlind);
    this.turn!.lastAction = { kind: "big blind" };
    this.advanceTurn();
    this.lastBetter = this.turn;
  }

  resetGame() {
    this.phase = 0;
    this.pot = 0;
    this.roundBet = 0;

    this.dealer = this.nextPlayer(this.dealer!);
    this.turn = this.dealer;
    this.lastBetter = this.turn;

    this.players.forEach((p) => {
      p.isFolded = false;
      if (p.stack === 0) this.getUp(p.id);
      p.roundBet = 0;
      p.potContribution = 0;
      p.lastAction = null;
    });
  }

  advanceTurn() {
    do {
      this.turn = this.nextPlayer(this.turn!);

      if (this.turn === this.lastBetter) {
        if (
          this.players.reduce(
            (s, p) => s + +(p.isPlaying && p.stack > 0 && !p.isFolded),
            0,
          ) === 1
        ) {
          this.phase = 5;
          return;
        }
        this.turn = this.nextPlayer(this.dealer!);
        this.lastBetter = this.turn;
        this.roundBet = 0;
        this.players.forEach((p) => {
          p.roundBet = 0;
          p.lastAction = null;
        });
        this.phase += 1;

        this.chooseWinner([]);
      }
    } while (
      this.phase < 5 &&
      (!this.turn!.isPlaying || this.turn!.isFolded || this.turn!.stack === 0)
    );
  }

  callRaise(amount = 0) {
    if (this.phase === 0 || this.phase === 5) return;
    const player = this.turn!;
    if (player.isFolded) return;

    const toCall = this.roundBet - player.roundBet;
    const total = Math.min(player.stack, toCall + amount);

    if (amount) {
      this.lastBetter = this.turn;

      if (this.roundBet) {
        player.lastAction = { kind: "raise", amount };
      } else {
        player.lastAction = { kind: "bet", amount };
      }
    } else {
      if (this.roundBet) {
        player.lastAction = { kind: "call" };
      } else {
        player.lastAction = { kind: "check" };
      }
    }

    player.stack -= total;
    player.roundBet += total;
    player.potContribution += total;
    this.pot += total;
    this.roundBet += amount;

    if (player.stack === 0) {
      player.lastAction = { kind: "all in" };
    }
  }

  fold() {
    if (this.phase === 0 || this.phase === 5) return;
    this.turn!.isFolded = true;
    this.turn!.lastAction = { kind: "fold" };

    this.checkForFoldWin();
  }

  private checkForFoldWin() {
    if (this.players.reduce((s, p) => s + +!p.isFolded, 0) === 1) {
      const lastPlayer = this.players.find((p) => !p.isFolded)!;
      lastPlayer.stack += this.pot;
      this.lastWinner = lastPlayer;
      this.resetGame();
    }
  }

  chooseWinner(ps: number[]) {
    const pots = this.generatePots();
    if (
      ps.length !== pots.length ||
      !ps.every((p, i) => pots[i]!.players.includes(p))
    )
      return;
    this.lastWinner = this.players[ps[0]!]!;

    ps.forEach((p, i) => {
      this.players[p]!.stack +=
        pots[i]!.contribPerPlayer * pots[i]!.players.length;
    });

    this.resetGame();
  }

  generatePots() {
    const playersEnum = this.players.map((p, i): [number, Player] => [i, p]);
    playersEnum.sort((pa, pb) => pa[1].potContribution - pb[1].potContribution);
    // WARN: O(n^2)
    return playersEnum.reduce(
      (pots, [pi, p]) => {
        const cpp =
          p.potContribution - pots.reduce((s, p) => s + p.contribPerPlayer, 0);
        pots.forEach((pot) => {
          pot.players.push(pi);
        });
        if (cpp) pots.push({ contribPerPlayer: cpp, players: [pi] });
        return pots;
      },
      [] as { contribPerPlayer: number; players: number[] }[],
    );
  }
}
