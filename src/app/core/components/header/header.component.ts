import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { Mocker } from 'src/app/shared/models/user.model';
import { Router } from '@angular/router';
import {
  ROUTER_LINKS,
  DB_COLLECTIONS
} from 'src/app/shared/common/app.constants';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user: Mocker;

  public selectedUser: Mocker;

  public users: Mocker[];

  public searchText: string;

  constructor(
    private us: UserService,
    private router: Router,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.us.emitUserData.subscribe(data => {
      this.user = data;
      if (this.user) {
        // this.router.navigate([ROUTER_LINKS.CHATS]);
      } else {
        this.router.navigate([ROUTER_LINKS.SIGN_IN]);
      }
    });
  }

  public searchUser() {
    console.log(this.searchText);
    // this.us
    //   .getUserByText(DB_COLLECTIONS.USERS, this.searchText)
    //   .subscribe(data => {
    //     this.users = data;
    //   });
    this.fs
      .collection(
        'users',
        ref =>
          ref
            .orderBy('userName')
            .startAt(this.searchText)
            .endAt(this.searchText + '\uf8ff')
        // .orderBy('userName', 'asc')
      )
      .valueChanges()
      .subscribe((d: Mocker[]) => {
        this.users = d;
      });
  }

  public routeToUserProfile(event) {
    this.router.navigate([ROUTER_LINKS.PROFILE, event.source.nzValue]);
  }
}
