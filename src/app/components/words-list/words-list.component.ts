import { PointsService } from './../../services/points.service';
import { GameService } from 'src/app/services/game.service';
import { Component, OnInit } from '@angular/core';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { GameLogicService } from 'src/app/services/game-logic.service';
import { Game, Player } from 'src/app/models/types';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-words-list',
  templateUrl: './words-list.component.html',
  styleUrls: ['./words-list.component.scss']
})
export class WordsListComponent implements OnInit {
  private hotRegisterer = new HotTableRegisterer();

  dataset: any[] = [];
  id = 'hotInstance';
  settings: Handsontable.GridSettings = {
    licenseKey: "non-commercial-and-evaluation",
    data: Handsontable.helper.createSpreadsheetData(1, 4),
    height: '50vh',
    width: '50vw',
    stretchH: 'all',
    colHeaders: true,
    rowHeaders: true,
  }
  constructor(private gameService: GameService, private gameLogicService: GameLogicService, private pointsService: PointsService) {
    this.gameService.players$.subscribe(players => {
      console.log('update from Game service :', players);
      this.updateUI(players);
    });
  }
  ngOnInit(): void {
    this.dataset = [];
    this.updateUI(this.gameService.players);
  }
  private updateUI(players: Player[]) {
    let id = 0;
    let guesses: string[] = [];
    players.map((player) => guesses = guesses.concat(player.guesses));
    // console.log('guesses: ', guesses);
    this.dataset = Handsontable.helper.createSpreadsheetData(1, 4);
    this.hotRegisterer.getInstance(this.id)?.loadData(this.dataset);
    this.dataset = [];
    players.map(p => {
      p.guesses.map(guess => {
        const result = this.gameLogicService.checkWord(guess)
        this.dataset.push({ id: id++, word: guess, player: p.name, cows: result.cows, bulls: result.bulls })
        console.log('In words ui update', this.dataset);
        this.hotRegisterer.getInstance(this.id)?.loadData(this.dataset);
        if (result.bulls === 4 && this.gameService.myTurn) {
          const pid = p.id || '';
          this.pointsService.correctGuess(pid, guesses);
        }
      });
    });
  }
}
