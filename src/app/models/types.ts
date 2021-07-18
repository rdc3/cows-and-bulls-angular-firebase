import { Consts } from "./consts";
import firebase from 'firebase';

export class Player {
    id?: string;
    name: string;
    points: number;
    guesses: string[];
    isModerator: boolean;
    timestamp?: any;
    availability: Availability;
    constructor(player: Player | null) {
        if (!player) {
            this.name = "";
            this.points = 0;
            this.guesses = [];
            this.isModerator = false;
            this.availability = Availability.online
        } else {
            this.id = player.id;
            this.name = player.name;
            this.points = player.points;
            this.guesses = [...player.guesses];
            this.isModerator = player.isModerator;
            this.timestamp = player.timestamp;
            this.availability = player.availability;
        }
    }
    public equals(player: Player) {
        return this.id === player.id &&
            this.name === player.name &&
            this.points === player.points &&
            this.guesses.length === player.guesses.length && this.guesses.every(function (value, index) { return value === player.guesses[index] }) &&
            this.isModerator === player.isModerator &&
            this.availability === player.availability;
    }
}
export class Game {
    public id?: string;
    public state: GameState;
    public maxWordsToGuess: number;
    public maxRounds: number;
    public timeLimitInMin: number
    public round: RoundInfo;
    constructor(game: Game | null) {
        if (!game) {
            this.state = GameState.NotCreated;
            this.maxWordsToGuess = Consts.defaultGame_MaxWords;
            this.timeLimitInMin = Consts.defaultGame_TimeLimit;
            this.maxRounds = Consts.defaultGame_MaxRounds;
            this.round = new RoundInfo(null);
        } else {
            this.id = game.id;
            this.state = game.state;
            this.maxWordsToGuess = game.maxWordsToGuess;
            this.timeLimitInMin = game.timeLimitInMin;
            this.maxRounds = game.maxRounds;
            this.round = new RoundInfo(game.round);
        }
    }
    public equals(game: Game) {
        return this.id === game.id &&
            this.state === game.state &&
            this.maxWordsToGuess === game.maxWordsToGuess &&
            this.maxRounds === game.maxRounds &&
            this.timeLimitInMin === game.timeLimitInMin &&
            this.round.equals(game.round)
    }
}
export interface ChatMessage {
    id?: string;
    by: string;
    message: string;
    at: any;
}
export class RoundInfo {
    roundNumber: number;
    turn: Player | null | undefined;
    word: string;
    startedAt: Date | any;
    yetToPlay: Player[];
    constructor(round: RoundInfo | null) {
        if (round) {
            this.roundNumber = round.roundNumber;
            this.turn = round.turn;
            this.word = round.word;
            this.startedAt = round.startedAt;
            this.yetToPlay = round.yetToPlay.map(p => new Player(p));
        } else {
            this.roundNumber = 0;
            this.turn = null;
            this.word = '';
            this.startedAt = null;
            this.yetToPlay = [];
        }
    }
    public equals(round: RoundInfo) {
        return this.roundNumber === round.roundNumber &&
            this.turn === round.turn &&
            this.word === round.word &&
            this.startedAt === round.startedAt &&
            this.yetToPlay.length === round.yetToPlay.length && this.yetToPlay.every(function (value, index) { return value.equals(round.yetToPlay[index]) })
    }
}
export enum GameState {
    NotCreated,
    Created,
    Started,
    WaitingForNextWord,
    Guessing,
    Finished
}
export interface Result {
    cows: number;
    bulls: number;
}
export enum Availability {
    online,
    offline,
    away
}