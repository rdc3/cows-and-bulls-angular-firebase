import { UserAvailabilityService } from './../../services/user-availability.service';
import { Availability, Player } from 'src/app/models/types';
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
  constructor(private gameService: GameService, private userAvailabilityService: UserAvailabilityService) {
    this.gameService.players$.subscribe(_ => {
      this.userAvailabilityService.check();
      this.setTableData();
    });
  }

  ngOnInit(): void {
    this.setTableData();
  }
  private setTableData() {
    this.playerTableData = [];
    this.gameService.players$.value.map(player => this.playerTableData.push({
      name: player.name,
      points: player.points.toString(),
      available: player.availability
    }))
    this.dataSource = [...this.playerTableData];
  }
  setAvailabilityClass(available: Availability) {
    let availableClass = 'offline'
    switch (available) {
      case Availability.online:
        availableClass = 'online';
        break;
      case Availability.offline:
        availableClass = 'offline';
        break;
      case Availability.away:
        availableClass = 'away';
        break;
    }
    return availableClass;
  }
}
export interface IPlayersTable {
  name: string;
  points: string;
  available: Availability;
}