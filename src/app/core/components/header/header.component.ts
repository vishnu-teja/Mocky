import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { Mocker } from 'src/app/shared/models/user.model';
import { Router } from '@angular/router';
import {
  ROUTER_LINKS,
  DB_COLLECTIONS
} from 'src/app/shared/common/app.constants';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../../shared/models/user.model';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user: User;

  public selectedUser: User;

  public users: User[];

  public searchText: string;

  constructor(
    private us: UserService,
    private router: Router,
    private fs: AngularFirestore,
    private afs: AngularFireMessaging
  ) {}

  ngOnInit() {
    this.us.emitUserData.subscribe(data => {
      this.user = data;
    });
  }

  public searchUser() {
    if (!this.searchText) {
      this.users = [];
    } else {
      this.fs
        .collection('users', ref =>
          ref
            .orderBy('userName')
            .startAt(this.searchText)
            .endAt(this.searchText + '\uf8ff')
        )
        .valueChanges()
        .subscribe((d: User[]) => {
          this.users = d;
        });
    }
  }

  public routeToUserProfile(event) {
    this.router
      .navigate([ROUTER_LINKS.PROFILE, event.source.nzValue])
      .then(() => {
        this.searchText = '';
      });
  }

  public logout() {
    this.us.logout().then(() => {
      localStorage.clear();
      this.removePushNotifications();
    });
  }

  private removePushNotifications() {
    this.afs.getToken.subscribe(t => {
      this.fs
        .collection('fcmTokens')
        .doc(this.user.key)
        .collection('tokens')
        .doc(t)
        .delete()
        .finally(() => {
          this.us.emitUserData.next(null);
          this.router.navigate([ROUTER_LINKS.SIGN_IN]);
        });
    });
  }

  public gotoProfile() {
    this.router.navigate([ROUTER_LINKS.PROFILE, this.user.fullName]);
  }
  public gotoChats() {
    this.router.navigate([ROUTER_LINKS.CHATS]);
  }
}
