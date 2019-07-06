import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CryptoService } from './../../services/crypto.service';
import { tap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @ViewChild('textArea') textArea;
  public onChats = true;
  public messages$: Observable<any>;
  public loading = false;
  private timeOut;

  private mockerUId: string;

  private myProfileMock$: any;
  private mockerProfileMock$: any;

  public message: string;

  public myProfile: User;

  public mockerProfile: User;

  private chatKey: string;

  private queryParams;

  constructor(
    private us: UserService,
    private r: Router,
    private ar: ActivatedRoute,
    private fs: AngularFirestore,
    private cs: CryptoService
  ) {}

  ngOnInit() {
    this.myProfile = this.us.emitUserData.getValue();
    this.getChatId();
  }

  private getChatId() {
    this.ar.queryParamMap.subscribe((data: any) => {
      this.message = null;
      this.queryParams = data.params;
      this.loading = true;
      this.mockerProfile = null;

      if ('uId' in this.queryParams) {
        this.onChats = false;
        this.chatKey = this.myProfile.key + this.queryParams.uId;
        this.mockerUId = this.queryParams.uId;
        this.setProfiles(true);
        this.getMessages();
      } else if ('chatId' in this.queryParams) {
        this.onChats = false;
        this.chatKey = this.queryParams.chatId;

        this.fs
          .collection(DB_COLLECTIONS.CHATS)
          .doc(this.chatKey)
          .valueChanges()
          .pipe(
            tap((c: any) => {
              this.mockerUId = c.users.find(u => u !== this.myProfile.key);
              this.setProfiles(false);
            })
          )
          .subscribe();

        this.getMessages();
      } else {
        this.onChats = true;
        this.loading = false;
        this.messages$ = null;
      }
    });
  }

  private setProfiles(newChat: boolean) {
    this.fs
      .collection(DB_COLLECTIONS.USERS)
      .doc(this.mockerUId)
      .valueChanges()
      .pipe(
        tap((u: User) => {
          this.mockerProfile = u;

          this.myProfileMock$ = this.fs
            .collection(DB_COLLECTIONS.USERS)
            .doc(this.myProfile.key)
            .collection(DB_COLLECTIONS.MOCKERS)
            .doc(this.mockerProfile.key);
          this.mockerProfileMock$ = this.fs
            .collection(DB_COLLECTIONS.USERS)
            .doc(this.mockerProfile.key)
            .collection(DB_COLLECTIONS.MOCKERS)
            .doc(this.myProfile.key);

          this.myProfileMock$.update({ newMessageCount: 0 });

          if (newChat) {
            this.createChat(this.chatKey);

            const msg: Message = {
              message: this.cs.set(this.chatKey, 'hello!'),
              sentBy: this.myProfile.key,
              date: firebase.firestore.Timestamp.now(),
              senderName: this.myProfile.fullName,
              senderImage: this.myProfile.imageLink,
              recievedBy: this.mockerProfile.key
            };

            this.updateChat(this.chatKey, msg);

            this.setInProfile(
              this.chatKey,
              this.mockerProfile,
              this.myProfileMock$
            );

            this.setInProfile(
              this.chatKey,
              this.myProfile,
              this.mockerProfileMock$
            );
          }
        })
      )
      .subscribe();
  }

  public getMessages() {
    this.messages$ = this.fs
      .collection(DB_COLLECTIONS.CHATS)
      .doc(this.chatKey)
      .collection('conversations', ref => ref.orderBy('date', 'desc'))
      .valueChanges()
      .pipe(
        tap(() => {
          this.loading = false;
        })
      );

    const objDiv: any = document.getElementsByClassName('chats');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  private createChat(key: string) {
    this.fs
      .collection(DB_COLLECTIONS.CHATS)
      .doc(key)
      .set({ users: [this.myProfile.key, this.mockerProfile.key] });
  }

  private updateChat(key: string, msg: object): void {
    this.fs
      .collection(DB_COLLECTIONS.CHATS)
      .doc(key)
      .collection(DB_COLLECTIONS.CONVERSATIONS)
      .add(msg);
  }

  public sendMsg() {
    if (this.message) {
      const msg: Message = {
        message: this.message ? this.cs.set(this.chatKey, this.message) : null,
        sentBy: this.myProfile.key,
        senderName: this.myProfile.fullName,
        senderImage: this.myProfile.imageLink,
        recievedBy: this.mockerProfile.key,
        date: firebase.firestore.Timestamp.now()
      };

      const key =
        this.queryParams.chatId || this.myProfile.key + this.queryParams.uId;
      this.updateChat(key, msg);
      this.updateProfile();
      this.message = null;
      this.textArea.nativeElement.focus();
    }
  }

  public decryptMsg(msg: string) {
    return this.cs.get(this.chatKey, msg);
  }

  private setInProfile(key: string, profile: User, profile$: any) {
    const mocker: Mocker = {
      chatId: key,
      mockerName: profile.fullName,
      imageLink: profile.imageLink,
      newMessageCount: 1,
      lastUpdated: firebase.firestore.Timestamp.now()
    };

    profile$.set(mocker);
  }
  private updateProfile() {
    this.mockerProfileMock$.update({
      newMessageCount: firebase.firestore.FieldValue.increment(1),
      lastUpdated: firebase.firestore.Timestamp.now()
    });

    this.myProfileMock$.update({
      lastUpdated: firebase.firestore.Timestamp.now()
    });
  }

  public dateFormatter(date) {
    return new Date(date.toDate()).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  keyBoardEnter(event) {
    clearTimeout(this.timeOut);
    event.stopPropagation();
    this.timeOut = setTimeout(() => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (this.message.length > 1) {
          this.sendMsg();
        } else {
          this.message = null;
        }
      }
    }, 400);
  }

  onBack() {
    this.r.navigate([ROUTER_LINKS.CHATS]);
  }
}
