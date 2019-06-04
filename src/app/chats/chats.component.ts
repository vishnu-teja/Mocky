import { Component, OnInit } from '@angular/core';
import { Message } from './../shared/models/message.model';
import { MESSAGE_TYPE } from '../shared/common/app.constants';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  public messages: Message[] = [
    { type: MESSAGE_TYPE.SENT, message: 'hello world' },
    { type: MESSAGE_TYPE.RECIEVED, message: 'lol asshole' }
  ];
  private blah = true;
  constructor() {}

  ngOnInit() {}

  public sendMsg(msg) {
    const message: Message = {
      type: this.blah ? MESSAGE_TYPE.SENT : MESSAGE_TYPE.RECIEVED,
      message: msg
    };
    this.messages.push(message);
    this.blah = !this.blah;
  }
}
