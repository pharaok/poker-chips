import { Player } from "./index";

export class Room {
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
  phase: number;
  pot: number;
  roundBet: number;
  turn: number; // Player index
  dealer: number; // Player index
  lastRaiser: number; // Player index
  players: Player[];

  constructor() {
    this.buyIn = 10000;
    this.smallBlind = 100;
    this.bigBlind = 200;
    this.phase = 0;
    this.pot = 0;
    this.roundBet = 0;
    this.turn = 0;
    this.dealer = 0;
    this.lastRaiser = 0;
    this.players = [];
  }

  joinTable(player: Player, at?: number) {
    at ??= this.players.length;
    this.players.splice(at, 0, player);
  }

  leaveTable(id: string) {
    this.players = this.players.filter((p) => p.id !== id);
  }

  startGame() {
    if (this.players.length < 2) return;
    if (this.phase !== 0) return;
    const d = this.dealer;
    const p = this.players.length;

    this.players[(d + 1) % p]!.stack -= this.smallBlind;
    this.players[(d + 1) % p]!.roundBet += this.smallBlind;
    this.players[(d + 1) % p]!.potContribution += this.smallBlind;

    this.players[(d + 2) % p]!.stack -= this.bigBlind;
    this.players[(d + 2) % p]!.roundBet += this.bigBlind;
    this.players[(d + 2) % p]!.potContribution += this.bigBlind;

    this.pot += this.smallBlind + this.bigBlind;
    this.roundBet = this.bigBlind;
    this.turn = (d + 3) % p;
    this.lastRaiser = (d + 3) % p;
    this.phase += 1;
  }

  resetGame() {
    this.phase = 0;
    this.pot = 0;
    this.roundBet = 0;

    this.dealer += 1;
    this.dealer %= this.players.length;
    this.turn = this.dealer;
    this.lastRaiser = this.turn;

    this.players.forEach((p) => {
      p.didFold = false;
      p.roundBet = 0;
      p.potContribution = 0;
    });
  }

  private advanceTurn() {
    do {
      this.turn += 1;
      this.turn %= this.players.length;

      if (this.turn === this.lastRaiser) {
        this.turn = (this.dealer + 1) % this.players.length;
        this.lastRaiser = this.turn;
        this.roundBet = 0;
        this.players.forEach((p) => {
          p.roundBet = 0;
        });
        this.phase += 1;

        this.chooseWinner([]);
      }
    } while (
      this.phase < 5 &&
      (this.players[this.turn]!.didFold || this.players[this.turn]!.stack === 0)
    );
  }

  callRaise(amount = 0) {
    // TODO: sidepots
    if (this.phase === 0 || this.phase === 5) return;
    const player = this.players[this.turn]!;
    if (player.didFold) return;

    const toCall = this.roundBet - player.roundBet;
    const total = Math.min(player.stack, toCall + amount);

    player.stack -= total;
    player.roundBet += total;
    player.potContribution += total;
    this.pot += total;
    this.roundBet += amount;

    if (amount) this.lastRaiser = this.turn;
    this.advanceTurn();
  }

  fold() {
    if (this.phase === 0 || this.phase === 5) return;
    this.players[this.turn]!.didFold = true;
    this.advanceTurn();

    if (this.players.reduce((s, p) => s + +!p.didFold, 0) === 1) {
      this.players[this.turn]!.stack += this.pot;
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

    ps.forEach((p, i) => {
      this.players[p]!.stack +=
        pots[i]!.contribPerPlayer * pots[i]!.players.length;
    });

    this.resetGame();
  }

  generatePots() {
    const playersEnum = this.players.map((p, i): [number, Player] => [i, p]);
    playersEnum.sort((pa, pb) => pa[1].potContribution - pb[1].potContribution);
    return playersEnum.reduce(
      (pots, [pi, p]) => {
        const cpp =
          p.potContribution - (pots[pots.length - 1]?.contribPerPlayer ?? 0);
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
