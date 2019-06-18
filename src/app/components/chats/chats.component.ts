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

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  public messages$: Observable<any>;

  public message: string;

  private myProfile: Mocker;

  constructor(
    private us: UserService,
    private r: Router,
    private ar: ActivatedRoute,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.messages$ = this.fs.collection('/messages').valueChanges();
    this.fs
      .collection('/messages')
      .add({ msg: 'adsf' })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    this.myProfile = this.us.emitUserData.getValue();
    this.getChatId();
  }

  private getChatId() {
    this.ar.queryParamMap.subscribe((data: any) => {
      console.log(data.params);
    });
  }

  public sendMsg() {
    this.message = null;
  }

  private updateMyProfile() {}
}
