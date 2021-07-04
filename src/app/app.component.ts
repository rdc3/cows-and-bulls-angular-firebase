import { NavigatorService } from './services/navigator.service';
import { GameService } from 'src/app/services/game.service';
import { Component } from '@angular/core';
import { Consts } from './models/consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CowsAndBulls';
  public playername = localStorage.getItem(Consts.localStorage_player) || 'player';
  constructor(private gameService: GameService, private navigator: NavigatorService) {
    this.gameService.players$.subscribe(p => this.playername = this.gameService.player.name);
  }
  logout() {
    this.gameService.logout();
  }
  navigateHome() {
    this.navigator.gotoHomePage();
  }
}
