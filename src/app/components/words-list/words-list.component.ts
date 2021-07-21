import { NotifierService } from './../../services/notifier.service';
import { PointsService } from './../../services/points.service';
import { GameService } from 'src/app/services/game.service';
import { Component, OnInit } from '@angular/core';
import { GameLogicService } from 'src/app/services/game-logic.service';
import { GameState, Player } from 'src/app/models/types';

@Component({
  selector: 'app-words-list',
  templateUrl: './words-list.component.html',
  styleUrls: ['./words-list.component.scss']
})
export class WordsListComponent implements OnInit {

  public displayedColumns: string[] = ['word', 'player', 'cows', 'bulls'];
  dataset: any[] = [];
  constructor(private gameService: GameService, private gameLogicService: GameLogicService, private pointsService: PointsService,
    private notifier: NotifierService) {
    this.gameService.players$.subscribe(_ => {
      this.updateUI();
    });
  }
  ngOnInit(): void {
    this.dataset = [];
  }
  private updateUI() {
    let id = 0;
    let guesses: string[] = [];
    this.gameService.players$.value.map((player) => guesses = guesses.concat(player.guesses));
    this.dataset = [];
    this.gameService.players$.value.map(p => {
      p.guesses.map(guess => {
        const result = this.gameLogicService.checkWord(guess)
        if (result.bulls === 4) {
          this.notifier.popup(`${(p.id === this.gameService.player.id) ? 'You' : p.name} guessed ${this.gameService.game.round.word}`, 'Correct Guess')
          this.gameService.game.state = GameState.WaitingForNextWord;
          this.gameService.game$.next(this.gameService.game);
        }
        this.dataset.push({ id: id++, word: guess, player: p.name, cows: result.cows, bulls: result.bulls })
        if (result.bulls === 4 && this.gameService.myTurn) {
          const pid = p.id || '';
          this.pointsService.correctGuess(pid, guesses);
        }
      });
    });
  }
}
