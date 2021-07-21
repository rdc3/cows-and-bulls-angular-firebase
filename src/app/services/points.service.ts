import { PlayerSelectorService } from './player-selector.service';
import { GameService } from 'src/app/services/game.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  constructor(private gameService: GameService, private playerSelectorService: PlayerSelectorService) { }
  public correctGuess(playerId: string, guesses: string[]) {
    const player = this.gameService.players$.value.find(p => p.id === playerId);
    console.log('Correct guess', player);
    let points: number = player?.points || 0;
    points += Math.round(30 - guesses.length - 1);
    player!.points = points;
    player!.guesses = [];
    if (player) {
      this.gameService.savePlayer(player).subscribe();
    }
    this.playerSelectorService.nextPlayer();
  }
}
