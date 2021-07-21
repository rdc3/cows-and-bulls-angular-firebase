import { GameService } from 'src/app/services/game.service';
import { Injectable } from '@angular/core';
import { GameState, Player } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class PlayerSelectorService {

  constructor(private gameService: GameService) { }
  public nextRound() {
    console.log('starting nextRound', this.gameService.game);
    if (!this.gameService.game.round.yetToPlay || this.gameService.game.round.yetToPlay.length === 0) {
      this.gameService.game.round.yetToPlay = this.gameService.players$.value;
    }
    this.gameService.game.round!.roundNumber++;
    this.nextPlayer();
  }

  public nextPlayer() {
    if (this.gameService.game.round.yetToPlay?.length === 0) { this.nextRound(); }
    this.gameService.game.round!.startedAt = new Date();
    this.gameService.game.round!.turn = this.gameService.game.round.yetToPlay[0];
    this.gameService.game.round.yetToPlay.splice(0, 1);
    this.gameService.game.state = GameState.WaitingForNextWord;
    console.log('selecting next player', this.gameService.game);
    this.gameService.players$.value.forEach(player => {
      if (player.guesses.length > 0) {
        player.guesses = [];
        this.gameService.savePlayer(player).subscribe();
      }
    });
    this.gameService.saveGame(this.gameService.game).subscribe();
  }
}
