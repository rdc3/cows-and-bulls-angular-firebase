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
  constructor(private gameService: GameService) {
    this.gameService.players$.subscribe(players => {
      this.setTableData(players);
    });
  }

  ngOnInit(): void {
    this.setTableData(this.gameService.players);
  }
  private setTableData(players: Player[]) {
    this.playerTableData = [];
    players.map(player => this.playerTableData.push({ name: player.name, points: player.points.toString() }))
    this.dataSource = [...this.playerTableData];
  }
}
export interface IPlayersTable {
  name: string;
  points: string;
}