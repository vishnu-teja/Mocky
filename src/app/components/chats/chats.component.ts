import { Component, OnInit } from '@angular/core';
import { Message } from '../../shared/models/message.model';
import { MESSAGE_TYPE, ROUTER_LINKS } from '../../shared/common/app.constants';
import { Mocker } from 'src/app/shared/models/user.model';
import { UserService } from './../../services/user.service';
import { DB_COLLECTIONS } from 'src/app/shared/common/app.constants';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './../../shared/models/user.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  private isNewConversation: boolean;
  public messages$: Observable<any>;

  public message: string;

  private myProfile: User;

  private queryParams;

  constructor(
    private us: UserService,
    private r: Router,
    private ar: ActivatedRoute,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.myProfile = this.us.emitUserData.getValue();
    this.getChatId();
  }

  private getChatId() {
    this.ar.queryParamMap.subscribe((data: any) => {
      let key;
      this.queryParams = data.params;
      if ('uId' in this.queryParams) {
        this.isNewConversation = true;
        key = this.myProfile.key + this.queryParams.uId;
      } else {
        this.isNewConversation = false;
        key = this.queryParams.chatId;
      }

      this.messages$ = this.fs
        .collection(DB_COLLECTIONS.CHATS)
        .doc(key)
        .collection('conversations')
        .valueChanges();
    });
  }

  private createChat(key: string, msg: object): void {
    this.fs
      .collection(DB_COLLECTIONS.CHATS)
      .doc(key)
      .collection(DB_COLLECTIONS.CONVERSATIONS)
      .add(msg);
    this.isNewConversation = false;
  }

  private updateChat(key: string, msg: object): void {
    this.fs
      .collection(DB_COLLECTIONS.CHATS)
      .doc(key)
      .collection(DB_COLLECTIONS.CONVERSATIONS)
      .add(msg);
  }

  public sendMsg() {
    const msg: Message = {
      message: this.message,
      sentBy: this.myProfile.key,
      date: new Date().toString()
    };

    if ('uId' in this.queryParams && this.isNewConversation) {
      const key = this.myProfile.key + this.queryParams.uId;
      this.createChat(key, msg);
      this.updateProfile(key, this.queryParams.uId, this.myProfile.key);

      this.updateProfile(key, this.myProfile.key, this.queryParams.uId);
    } else {
      const key =
        this.queryParams.chatId || this.myProfile.key + this.queryParams.uId;
      this.updateChat(key, msg);
    }
    this.message = null;
  }

  private updateProfile(key: string, uId: string, email: string) {
    this.fs
      .collection(DB_COLLECTIONS.USERS)
      .doc(email)
      .collection('mockers')
      .doc(uId)
      .set({ chatId: key });
  }
}
