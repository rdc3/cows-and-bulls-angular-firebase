import { ChatMessage } from './../models/types';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Consts } from '../models/consts';
import { Game, Player } from '../models/types';
import firebase from 'firebase';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  public players$: Observable<Player[]>;
  private games$: Observable<Game[]>;
  public game$: Subject<Game> = new Subject();
  private playersDBRef = this.store.collection(Consts.db_collection_player);
  private gameDBRef = this.store.collection(Consts.db_collection_game);
  private chatDBRef = this.store.collection(Consts.db_collection_chat);
  // private serverTimeOffsetRef = this.store.collection('serverTimeOffset');
  private players: Player[];
  private game: Game;
  public chat$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor(private store: AngularFirestore) {
    this.players$ = (this.playersDBRef.valueChanges({ idField: 'id' }) as Observable<Player[]>);
    this.games$ = this.gameDBRef.valueChanges({ idField: 'id' }) as Observable<Game[]>;
    // this.serverTimeOffsetRef.
    (this.chatDBRef.valueChanges({ idField: 'id' }) as Observable<ChatMessage[]>).subscribe((chat) => this.chat$.next(
      chat.sort((a, b) => {
        return a.at?.toMillis() < b.at?.toMillis() ? -1 : a.at?.toMillis() > b.at?.toMillis() ? 1 : 0
      })
    ))
    this.players$.subscribe(players => this.players = players.map(p => new Player(p)));
    this.games$.subscribe(g => {
      this.game = (g?.length) ? new Game(g[0]) : new Game(null);
      this.game$.next(new Game(g[0]));
    });
  }
  public getTimestamp(): any {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  addPlayers(player: Player) {
    if (this.players.find(p => p.name === player.name)) { return of(true); }
    if (player.name === '') { return of(false); }
    if (!player.id) { player.id = this.store.createId(); }
    localStorage.setItem(Consts.localStorage_player, player.name);
    return new Observable((observer) => {
      this.playersDBRef
        .add(JSON.parse(JSON.stringify(player)))
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  addNewChat(msg: ChatMessage) {
    if (!msg.id) { msg.id = this.store.createId(); }
    msg.at = this.getTimestamp();
    return new Observable((observer) => {
      this.chatDBRef.add(msg)
        .then(res => { observer.next(res); }, err => observer.error(err));
    })
  }
  deleteChatDb() {
    console.log('Deleting Chat data');
    return new Observable((observer) => {
      this.chatDBRef.get().subscribe(val => {
        val.forEach((doc) => doc.ref.delete().then((res => observer.next(res))).catch(err => observer.error(err)));
      })
    });
  }
  createGameDb(game: Game) {
    if (!game.id) { game.id = this.store.createId(); }
    console.log('adding game:', game);
    return new Observable((observer) => {
      this.gameDBRef
        .add(JSON.parse(JSON.stringify(game)))
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  updateGame(game: Game) {
    console.log('updating Game', game);
    // if (_.isEqual(this.game, game)) {
    if (this.game.equals(game)) {
      console.log(`No change in game. Not performing save.`, this.game, game);
      return of(true);
    }
    return new Observable((observer) => {
      this.gameDBRef
        .doc(game.id)
        .set(JSON.parse(JSON.stringify(game)), { merge: true })
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  updatePlayer(player: Player) {
    console.log('updating Player', player);
    const oldPlayerData = this.players.find(p => p.id === player.id);
    if (_.isEqual(oldPlayerData, player)) {
      console.log(`No change in player ${player.name}. Not performing save`, oldPlayerData, player);
      return of(true);
    }
    return new Observable((observer) => {
      this.playersDBRef
        .doc(player.id)
        .set(JSON.parse(JSON.stringify(player)), { merge: true })
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  deleteGame(game: Game) {
    console.log('Deleting Game', game);
    return new Observable((observer) => {
      this.gameDBRef
        .doc(game.id)
        .delete()
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  deletePlayer(player: Player) {
    console.log('Deleting Player', player);
    return new Observable((observer) => {
      this.playersDBRef
        .doc(player.id)
        .delete()
        .then(res => { observer.next(res); }, err => observer.error(err));
    });
  }
  clear() {
    this.players.map(p => { this.deletePlayer(p).subscribe() });
    this.deleteGame(this.game).subscribe();
    this.deleteChatDb().subscribe();
  }
}

