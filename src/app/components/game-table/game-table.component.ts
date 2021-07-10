import { Game, GameState, Player } from 'src/app/models/types';
import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss']
})
export class GameTableComponent {
  public waitingForGameStart = true;
  public protagonist: Player | null | undefined = new Player(null);
  public player: Player | null | undefined = new Player(null);
  public title = 'Almost there';
  public subtitle = 'Waiting for other players to join the game.';
  public myTurn = false;
  public addedInGame = false;
  round = 'Round 0';

  constructor(private gameService: GameService) {
    this.protagonist!.name = 'a player';
    this.setlocals(this.gameService.game);
    this.gameService.game$.subscribe(game => {
      this.setlocals(game);
    });
  }
  private setlocals(game: Game) {
    console.log('in setlocals:', this.gameService.addedInGame)
    console.log('in setlocals:', game)
    this.addedInGame = this.gameService.addedInGame;
    this.round = `Round ${game.round.roundNumber}`;
    this.player = this.gameService.player;
    this.protagonist = game.round!.turn;
    this.waitingForGameStart = game?.state < GameState.Started
    this.myTurn = this.gameService.myTurn;
    // console.log('In Game table: ', game, this.gameService.myTurn)
    // console.log('GameState:', game?.state, GameState.Started)
    if (this.myTurn) {
      this.title = (this.gameService.game.state === GameState.Guessing) ? 'You have chosen the word.' : 'Your turn ';
      this.subtitle = (this.gameService.game.state === GameState.Guessing) ? 'Other players are guessing now.' : 'Choose a 4 letter word for others to guess';
    } else if (!this.waitingForGameStart) {
      this.title = (this.gameService.game.state === GameState.Guessing) ? `${this.protagonist!.name} has chosen a word` : `${this.protagonist!.name}'s turn to choose a word`;
      this.subtitle = this.addedInGame ? 'Guess the 4 letter word' : 'Wait for the next game to join in.';
    }
  }
}
