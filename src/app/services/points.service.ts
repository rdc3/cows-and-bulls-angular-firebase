import { PlayerSelectorService } from './player-selector.service';
import { GameService } from 'src/app/services/game.service';
import { Player } from 'src/app/models/types';
import { Injectable } from '@angular/core';
// import { Consts } from '../models/consts';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  constructor(private gameService: GameService, private playerSelectorService: PlayerSelectorService) {
    // this.gameService.players$.subscribe(p => this.players = p);
  }
  public correctGuess(playerId: string, guesses: string[]) {
    const player = this.gameService.players$.value.find(p => p.id === playerId);
    console.log('Correct guess', player);
    // const localStorage_roundStartedAt = localStorage.getItem(Consts.localStorage_roundStartedAt);
    // const roundStart = +((localStorage_roundStartedAt) ? localStorage_roundStartedAt : new Date().valueOf().toString()) - 1;
    // const maxRoundTime = this.gameService.game.timeLimitInMin;
    // const timeElapsed = new Date().valueOf() - roundStart;
    let points: number = player?.points || 0;
    points += Math.round(100 - guesses.length);
    // const points = Math.round((maxRoundTime * 60 * 1000 / timeElapsed) * 1000 / guesses.length);
    player!.points = points;
    player!.guesses = [];
    if (player) {
      this.gameService.savePlayer(player).subscribe();
    }
    this.playerSelectorService.nextPlayer();
  }
}
