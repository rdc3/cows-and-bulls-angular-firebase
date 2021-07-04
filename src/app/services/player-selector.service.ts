import { GameService } from 'src/app/services/game.service';
import { Injectable } from '@angular/core';
import { Game, GameState, Player } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class PlayerSelectorService {

  private allPlayers: Player[];
  // private yetToPlay: Player[] = [];
  // private game: Game;
  constructor(private gameService: GameService) {
    this.gameService.players$.subscribe(players => this.allPlayers = players);
  }
  // public selectFirstPlayer() {
  //   this.nextRound();
  // }
  public nextRound() {
    console.log('starting nextRound', this.gameService.game);
    if (!this.gameService.game.round.yetToPlay || this.gameService.game.round.yetToPlay.length == 0) {
      this.gameService.game.round.yetToPlay = this.allPlayers;
    }
    this.gameService.game.round!.roundNumber++;
    this.nextPlayer();
  }

  public nextPlayer() {
    if (this.gameService.game.round.yetToPlay?.length == 0) { this.nextRound(); }
    const random = Math.floor(Math.random() * this.gameService.game.round.yetToPlay.length);
    this.gameService.game.round!.startedAt = new Date();
    this.gameService.game.round!.turn = this.gameService.game.round.yetToPlay[random];
    this.gameService.game.round.yetToPlay = this.gameService.game.round.yetToPlay.filter(p => p.id !== this.gameService.game.round!.turn!.id)
    this.gameService.game.round.yetToPlay = this.gameService.game.round.yetToPlay;
    this.gameService.game.state = GameState.WaitingForNextWord;
    console.log('selecting next player', this.gameService.game);
    this.gameService.players.forEach(player => {
      if (player.guesses.length > 0) {
        player.guesses = [];
        this.gameService.savePlayer(player).subscribe();
      }
    });
    this.gameService.saveGame(this.gameService.game).subscribe();
  }
}
