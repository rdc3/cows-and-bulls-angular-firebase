import { NotifierService } from './notifier.service';
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
  private chat: ChatMessage[] = [];
  constructor(private db: DbService, private gameService: GameService, private notifierService: NotifierService) {
    this.chat$.next(this.db.chat$.value);
    this.db.chat$.subscribe(chat => {
      if (this.chat.length !== chat.length) {
        this.chat$.next(chat);
        if (chat[chat.length - 1].by !== this.gameService.player.name) {
          this.notifierService.chatReceived(`${chat[chat.length - 1].by} says: ${chat[chat.length - 1].message}`);
        }
      }
    });
  }
  sendMessage(message: string) {
    this.db.addNewChat({ by: this.gameService.player.name, message: message, at: this.db.getTimestamp() }).subscribe()
  }
}