import { GameState, Player } from 'src/app/models/types';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Consts } from '../models/consts';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  private expectedRoute: string = '/';
  public joined = false;
  constructor(private router: Router) { }
  public gotoHomePage() {
    this.router.navigate(['./']);
  }
  public gotoGamePage() {
    this.router.navigate([Consts.route_game]);
  }
  public gotoExpectedPage() {
    this.router.navigate([this.expectedRoute]);
  }
  public detectWrongPage(gameState: GameState, player: Player, players: Player[]): boolean {
    this.expectedRoute = this.expectedPage(gameState, player, players);
    if (this.expectedRoute !== this.router.url) {
      return true;
    }
    return false;
  }
  private expectedPage(gameState: GameState, player: Player, players: Player[]): string {
    let playerInDb: Player | undefined = players.find(p => player.name === p.name)
    switch (gameState) {
      case GameState.Guessing:
      case GameState.Started:
      case GameState.Finished:
      case GameState.WaitingForNextWord:
        return `/${Consts.route_game}`;
      case GameState.NotCreated:
        return `/`;
      case GameState.Created:

        if (playerInDb?.id && !player.isModerator) {
          return `/${Consts.route_game}`;
        } else {
          return `/${Consts.route_joingame}`;
        }
      default:
        if (playerInDb?.id) {
          return `/${Consts.route_game}`;
        } else {
          return `/`;
        }
    }
  }
}
