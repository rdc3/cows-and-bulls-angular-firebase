import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { Availability, Game, GameRoom, GameState, Player } from '../models/types';
import { Consts } from '../models/consts';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { NavigatorService } from './navigator.service';
import { BehaviorSubject } from 'rxjs';
import { UserAvailabilityService } from './user-availability.service';
import firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  public game: Game = new Game(null);
  public player: Player = new Player(null);
  public players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  public game$: Subject<Game> = new Subject();
  public myTurn = false;
  private players: Player[] = [];
  public wordlist: any;
  public addedInGame = false;
  public gameRooms$: BehaviorSubject<GameRoom[]> = new BehaviorSubject<GameRoom[]>([]);
  public gameRoom: GameRoom;

  constructor(private db: DbService, private navigator: NavigatorService, private availability: UserAvailabilityService) {
    this.availability.availability$.subscribe(availability => {
      this.publishAvailability(availability);
      this.players$.next(this.players$.value.map(p => {
        if (p.id === this.player.id) { p.availability = availability; }
        return p;
      }))
    })
    this.player.name = localStorage.getItem(Consts.localStorage_player) || `player${Math.round(Math.random() * 100)}`;
    this.player.isModerator = localStorage.getItem(Consts.localStorage_isModerator) === 'true' || false;
    console.log('this.player.isModerator', this.player.isModerator, localStorage.getItem(Consts.localStorage_isModerator));
    if (localStorage.getItem(Consts.localStorage_isModerator) === undefined) {
      localStorage.setItem(Consts.localStorage_isModerator, `${this.player.isModerator}`);
    }
    combineLatest([this.db.game$, this.db.players$]).subscribe(([game, players]) => {
      (!this.detectChange(game, players)) ? console.log('no change detected') : console.log('change detected');
      let navigationRequired = this.navigator.detectWrongPage(game.state, this.player, players);
      if (!this.detectChange(game, players) && !navigationRequired) return;
      if (this.game.round.roundNumber !== game.round.roundNumber) {
        console.log(`********************************* NEW ROUND : ${this.game.round.roundNumber}/${game.round.roundNumber} **********************************************`);
      } else {
        console.log(`ROUND no: ${this.game.round.roundNumber}/${game.round.roundNumber}`);
      }
      this.game = new Game(game);
      // Update the cached player info with the data from db
      if (this.detectChangeInPlayers(players)) {
        this.players = players.map(player => {
          const p = new Player(player);
          if (p.id === this.player.id) { this.player = p; }
          return p;
        });
        this.players$.next([...this.players]);
      }
      console.log('Data fetched form db:**********************************************');
      console.log('Game:', this.game, '::Players:', this.players, '::Yet to Play', this.game.round.yetToPlay.map(p => p.name));
      let playerInDb: Player | undefined = players.find(p => this.player.name === p.name)
      // console.log('player form db:', playerInDb, this.player);
      this.player.id = playerInDb?.id;
      this.addedInGame = (playerInDb?.id) ? true : false;
      this.player.guesses = playerInDb?.guesses || [];
      if (this.game) {
        this.myTurn = this.game.round?.turn?.id === playerInDb?.id;
        console.log('my turn:', this.myTurn);
        this.game$.next(this.game);
        if (navigationRequired) {
          this.navigator.gotoExpectedPage();
        }
      }
    },
      err => console.log('err', err))
  }
  private detectChangeInPlayers(dbPlayers: Player[]) {
    console.log('Checking change Player:', this.players, dbPlayers);
    if (this.players.length === 0) {
      setTimeout(() => {
        this.publishAvailability(this.availability.availability$.value);
      }, 2000); // for page refresh
    }
    const changeDetected = !(this.players.length === dbPlayers.length && this.players.every((value, index) => {
      const change = value.equals(dbPlayers[index]);
      if (change && dbPlayers[index].id === this.player.id) {
        this.availability.check();
        if (this.availability.availability$.value !== dbPlayers[index].availability) {
          this.publishAvailability(this.availability.availability$.value);
        }
      }
      return change;
    }));
    console.log('changeDetected:', changeDetected, this.players);
    return changeDetected;
  }
  private publishAvailability(availability: Availability) {
    this.player.availability = availability;
    const player = this.players$.value.find(p => p.id === this.player.id);
    if (player) {
      player.availability = availability;
      this.savePlayer(player).subscribe();
    }
  }
  private detectChange(dbGame: Game, dbPlayers: Player[]) {
    console.log('Checking change Game:', this.game, dbGame);
    return this.players.length !== dbPlayers.length || !this.game.equals(dbGame) || this.detectChangeInPlayers(dbPlayers);
  }
  public initGame(maxRounds: number, maxTime: number, maxWords: number) {
    console.log('Game:', this.game);
    this.player.isModerator = true;
    let newGame = new Game(null);
    newGame.maxRounds = maxRounds;
    newGame.timeLimitInMin = maxTime;
    newGame.maxWordsToGuess = maxWords;
    newGame.state = GameState.Created;
    this.db.createGameRoom(new GameRoom(newGame, [])).subscribe((res: string) => console.log('Game Room created:', res));
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
      this.player.availability = Availability.online;
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
    return new Observable((observer) => {
      if (this.game.round?.word.toLocaleLowerCase() === word.toLocaleLowerCase()) {
        console.log('Player wins')
      }
      this.player.guesses = [...this.player.guesses, word];
      this.players$.next(this.players$.value);
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
  nextRound() {

  }
  createModerator() {
    this.players.map(p => {
      p.isModerator = p.id === this.player.id;
      this.db.updatePlayer(p).subscribe();
    });
  }
  public savePlayer(player: Player) {
    if (this.players$.value.find(p => p.id === player.id)) {
      return this.db.updatePlayer(player);
    }
    return of(false);
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
