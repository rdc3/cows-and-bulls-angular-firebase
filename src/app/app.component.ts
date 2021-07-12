import { WordlistService } from './services/wordlist.service';
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
  public addedInGame = false;
  constructor(private gameService: GameService, private navigator: NavigatorService, private wordlistService: WordlistService) {
    console.log('fetching words', wordlistService.isValidWord(''));
    this.gameService.players$.subscribe(p => {
      this.playername = this.gameService.player.name;
    });
    this.gameService.game$.subscribe(p => {
      this.addedInGame = this.gameService.addedInGame;
    });
  }
  logout() {
    this.gameService.logout();
  }
  navigateHome() {
    this.navigator.gotoHomePage();
  }
}
