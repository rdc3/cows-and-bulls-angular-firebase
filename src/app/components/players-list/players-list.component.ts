import { Player } from 'src/app/models/types';
import { GameService } from 'src/app/services/game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent implements OnInit {

  public playerTableData: IPlayersTable[] = [];
  public displayedColumns: string[] = ['player', 'points'];
  public dataSource: IPlayersTable[] = [];
  private players: Player[];
  constructor(private gameService: GameService) {
    this.gameService.players$.subscribe(players => {
      // console.log('***** constructor : Creating points table', this.gameService.players, players);
      this.players = players;
      this.setTableData();
    });
  }

  ngOnInit(): void {
    // console.log('***** ngOnInit : Creating points table', this.gameService.players);
    this.setTableData();
  }
  private setTableData() {
    console.log('***** Creating points table', this.gameService.players$.value);
    this.playerTableData = [];
    this.gameService.players$.value.map(player => this.playerTableData.push({ name: player.name, points: player.points.toString() }))
    this.dataSource = [...this.playerTableData];
  }
}
export interface IPlayersTable {
  name: string;
  points: string;
}