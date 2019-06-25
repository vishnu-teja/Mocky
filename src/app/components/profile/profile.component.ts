import { Component, OnInit } from '@angular/core';
import { Mocker } from 'src/app/shared/models/user.model';
import { UserService } from './../../services/user.service';
import {
  DB_COLLECTIONS,
  ROUTER_LINKS
} from 'src/app/shared/common/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: User;
  public loading = true;
  private myProfile: User;

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private router: Router,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.myProfile = this.us.emitUserData.getValue();
    this.route.paramMap.subscribe(d => {
      this.loading = true;
      this.getProfile(d.get('userName'));
    });
  }

  private getProfile(userName) {
    this.fs
      .collection(DB_COLLECTIONS.USERS, ref =>
        ref.where('userName', '==', userName)
      )
      .valueChanges()
      .subscribe((u: User[]) => {
        this.profile = u[0];
        this.loading = false;
      });
  }

  public startConversation() {
    this.fs
      .collection(DB_COLLECTIONS.USERS)
      .doc(this.myProfile.key)
      .collection(DB_COLLECTIONS.MOCKERS)
      .doc(this.profile.key)
      .valueChanges()
      .subscribe((m: Mocker) => {
        const isCoMocker =
          m && m.chatId ? { chatId: m.chatId } : { uId: this.profile.key };
        const obj = isCoMocker;
        this.router.navigate([ROUTER_LINKS.CHATS], { queryParams: obj });
      });
  }
}
