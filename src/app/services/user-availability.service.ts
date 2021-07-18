import { GameService } from 'src/app/services/game.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Availability } from '../models/types';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class UserAvailabilityService {
  public availability$: BehaviorSubject<Availability> = new BehaviorSubject<Availability>(Availability.offline)
  constructor() {
    document.addEventListener("visibilitychange", () => {
      this.check();
    });
  }
  check() {
    const availability = document.hidden ? Availability.away : Availability.online;
    if (this.availability$.value !== availability) {
      this.availability$.next(availability);
    }
  }
  goingOffline() {
    this.availability$.next(Availability.offline);
  }

}
