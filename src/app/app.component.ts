import { ChatService } from './services/chat.service';
import { NavigatorService } from './services/navigator.service';
import { GameService } from 'src/app/services/game.service';
import { Component, HostListener } from '@angular/core';
import { Consts } from './models/consts';
import { UserAvailabilityService } from './services/user-availability.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CowsAndBulls';
  public playername = localStorage.getItem(Consts.localStorage_player) || 'player';
  public addedInGame = false;
  constructor(private gameService: GameService, private navigator: NavigatorService, private userAvailabilityService: UserAvailabilityService, private chatService: ChatService) {
    this.gameService.players$.subscribe(p => {
      this.playername = this.gameService.player.name;
    });
    this.gameService.game$.subscribe(p => {
      this.addedInGame = this.gameService.addedInGame;
    });
    this.userAvailabilityService.check();
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.userAvailabilityService.goingOffline();
    console.log(`Connection Lost: Game`, JSON.stringify(this.gameService?.game));
    console.log(`Connection Lost: Player`, JSON.stringify(this.gameService?.player));
    this.chatService.sendMessage(`Connection Lost..`);
  }
  logout() {
    this.gameService.logout();
  }
  navigateHome() {
    this.navigator.gotoHomePage();
  }
}
