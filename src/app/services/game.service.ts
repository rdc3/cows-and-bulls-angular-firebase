import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { Game, GameState, Player } from '../models/types';
import { Consts } from '../models/consts';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { NavigatorService } from './navigator.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public game: Game = new Game(null);
  public player: Player = new Player(null);
  public players$: Subject<Player[]> = new Subject();
  public game$: Subject<Game> = new Subject();
  public myTurn = false;
  public players: Player[] = [];
  constructor(private db: DbService, private navigator: NavigatorService) {
    this.player.name = localStorage.getItem(Consts.localStorage_player) || `player${Math.round(Math.random() * 100)}`;
    this.player.isModerator = localStorage.getItem(Consts.localStorage_isModerator) === 'true' || false;
    console.log('this.player.isModerator', this.player.isModerator, localStorage.getItem(Consts.localStorage_isModerator));
    if (localStorage.getItem(Consts.localStorage_isModerator) === undefined) {
      localStorage.setItem(Consts.localStorage_isModerator, `${this.player.isModerator}`);
    }
    console.log('Fetching Game details from db');
    combineLatest([this.db.game$, this.db.players$]).subscribe(([game, players]) => {
      (!this.detectChange(game, players)) ? console.log('no change detected') : console.log('change detected');
      if (!this.detectChange(game, players)) return;
      this.player.isModerator = localStorage.getItem(Consts.localStorage_isModerator) === 'true' || false;
      if (this.game.round.roundNumber !== game.round.roundNumber) {
        console.log('********************************* NEW ROUND **********************************************');
      }
      this.game = new Game(game);
      if (this.detectChangeInPlayers(players)) {
        this.players = players.map(player => new Player(player));
        this.players$.next([...this.players]);
      }
      console.log('Data fetched form db:**********************************************');
      console.log('Game:', this.game);
      console.log('Players:', this.players);
      console.log('Yet to Play', this.game.round.yetToPlay.map(p => p.name));
      let playerInDb: Player | undefined = players.find(p => this.player.name === p.name)
      // console.log('player form db:', playerInDb, this.player);
      this.player.id = playerInDb?.id;
      if (this.game) {
        this.myTurn = this.game.round?.turn?.id === playerInDb?.id;
        console.log('my turn:', this.myTurn);
        this.game$.next(this.game);
        switch (this.game.state) {
          case GameState.Guessing:
          case GameState.Started:
          case GameState.Finished:
          case GameState.WaitingForNextWord:
            console.log('navigate 1');
            this.navigator.gotoGamePage();
            break;
          case GameState.NotCreated:
            console.log('navigate 2');
            this.navigator.gotoHomePage();
            break;
          case GameState.Created:
            console.log('navigate 3');
            if (!playerInDb || this.player.isModerator) {
              this.navigator.gotoJoinPage();
            } else {
              console.log('did not navigate..', playerInDb, this.player.isModerator);
            }
            break;
          default:
            if (playerInDb?.id) {
              console.log('navigate 4');
              this.player.id = playerInDb!.id;
              this.navigator.gotoGamePage();
            } else {
              console.log('navigate 5');
              this.navigator.gotoHomePage();
            }
            break;
        }
      }
    },
      err => console.log('err', err))
  }
  private detectChangeInPlayers(dbPlayers: Player[]) {
    console.log('Checking change Player:', this.players, dbPlayers);
    return !(this.players.length === dbPlayers.length && this.players.every(function (value, index) { return value.equals(dbPlayers[index]) }))
  }
  private detectChange(dbGame: Game, dbPlayers: Player[]) {
    console.log('Checking change Game:', this.game, dbGame);
    return this.players.length !== dbPlayers.length || !this.game.equals(dbGame) || this.detectChangeInPlayers(dbPlayers);
  }
  public initGame(maxRounds: number, maxTime: number, maxWords: number) {
    console.log('Game', this.game);
    if (this.game) {
      this.db.deleteGame(this.game);
    }
    this.player.isModerator = true;
    let newGame = new Game(null);
    newGame.maxRounds = maxRounds;
    newGame.timeLimitInMin = maxTime;
    newGame.maxWordsToGuess = maxWords;
    newGame.state = GameState.Created;
    this.db.addGame(newGame).subscribe(val => console.log(val));
    localStorage.setItem(Consts.localStorage_isModerator, `${this.player.isModerator}`);
  }
  public startGame() {
    console.log("Starting game");
    this.createModerator();
    this.game.state = GameState.WaitingForNextWord;
    this.saveGame().subscribe((res) => {
      console.log("player joined", res);
      console.log('navigate 5', this.game);
      this.navigator.gotoGamePage();
    })
  }
  setPlayerName(name: string): Observable<boolean> {
    return new Observable((observer) => {
      this.player.name = name;

      console.log("player joining", this.player);
      const forbidden = this.players && this.players.length > 0 && this.players.find(p => p.name === name) && name === '';
      if (!forbidden) {
        this.db.addPlayers(this.player).subscribe((res) => {
          console.log("player joined", res);
          if (!this.player.isModerator) {
            console.log('navigate 6');
            this.navigator.gotoGamePage();
          }
          observer.next(true);
        })
      } else {
        observer.next(false);
      }
    })
  }
  setNextWord(word: string): Observable<boolean> {
    return new Observable((observer) => {
      this.game.round!.word = word;
      // this.game.round!.startedAt = new Date();
      this.game.state = GameState.Guessing;
      this.game.round.startedAt = this.db.getTimestamp();
      this.db.updateGame(this.game).subscribe(
        res => {
          console.log(res);
          observer.next(true)
        }, err => {
          console.error(err);
          observer.next(false);
        }, () => {
          console.log();
        })
    })
  }
  newGuess(word: string): Observable<boolean> {
    console.log('Time:', this.db.getTimestamp(), this.game.round.startedAt.seconds)
    return new Observable((observer) => {
      if (this.game.round?.word.toLocaleLowerCase() === word.toLocaleLowerCase()) {
        console.log('Player wins')
      }
      this.player.guesses = [...this.player.guesses, word];
      this.db.updatePlayer(this.player).subscribe(
        res => {
          console.log(res);
          observer.next(true)
        }, err => {
          console.error(err);
          observer.next(false);
        }, () => {
          console.log();
        })
    })
  }
  createModerator() {
    this.players.map(p => {
      p.isModerator = p.id === this.player.id;
      this.db.updatePlayer(p).subscribe();
    });
  }
  public savePlayer(player: Player) {
    return this.db.updatePlayer(player);
  }
  public logout() {
    this.db.clear();
    console.log('navigate 7');
    this.navigator.gotoHomePage();
  }
  public saveGame(game: Game = this.game) {
    return this.db.updateGame(game);
  }
}
