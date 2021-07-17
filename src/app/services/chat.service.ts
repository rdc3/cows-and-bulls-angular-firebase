import { GameService } from 'src/app/services/game.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/types';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chat$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  constructor(private db: DbService, private gameService: GameService) {
    this.chat$.next(this.db.chat$.value);
    this.db.chat$.subscribe(chat => this.chat$.next(chat));
  }
  sendMessage(message: string) {
    this.db.addNewChat({ by: this.gameService.player.name, message: message, at: this.db.getTimestamp() }).subscribe()
  }
}
