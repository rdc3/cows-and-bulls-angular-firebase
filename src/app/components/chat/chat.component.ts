import { ChatService } from './../../services/chat.service';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/models/types';
import { GameService } from 'src/app/services/game.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessagesContainer') private myScrollContainer: ElementRef;
  playerName: string = 'Player';
  chatMessages: ChatMessage[] = [];
  public chatFormControl = new FormControl('');
  constructor(private gameService: GameService, private chatService: ChatService) {
    this.gameService.players$.subscribe(_ => this.playerName = this.gameService.player.name);
    this.chatMessages = this.chatService.chat$.value;
    this.chatService.chat$.subscribe(chat => {
      this.chatMessages = chat;
      console.log('**chat:', chat);
    });
  }

  submit() {
    if (this.chatFormControl.value) {
      this.chatService.sendMessage(this.chatFormControl.value);
      this.chatFormControl.reset();
    }
  }
  ngOnInit(): void {
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
