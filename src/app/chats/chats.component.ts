import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  public messages: string[];
  constructor() {}

  ngOnInit() {}

  public sendMsg(msg) {
    console.log(msg);
  }
}
