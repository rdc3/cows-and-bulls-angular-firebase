import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/models/types';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input() chatMessage: ChatMessage;
  @Input() me: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
