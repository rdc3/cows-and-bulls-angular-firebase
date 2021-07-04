import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Consts } from '../models/consts';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  constructor(private router: Router) { }
  public gotoHomePage() {
    this.router.navigate(['./']);
  }
  public gotoJoinPage() {
    this.router.navigate([Consts.route_joingame]);
  }
  public gotoGamePage() {
    this.router.navigate([Consts.route_game]);
  }
}
