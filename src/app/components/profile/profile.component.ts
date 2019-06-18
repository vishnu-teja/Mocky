import { Component, OnInit } from '@angular/core';
import { Mocker } from 'src/app/shared/models/user.model';
import { UserService } from './../../services/user.service';
import {
  DB_COLLECTIONS,
  ROUTER_LINKS
} from 'src/app/shared/common/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: Mocker;
  public loading = true;
  private myProfile: Mocker;

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private router: Router,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.myProfile = this.us.emitUserData.getValue();
    this.getProfile(this.route.snapshot.paramMap.get('userName'));
  }

  private getProfile(userName) {
    // this.us.getUser(DB_COLLECTIONS.USERS, userName).subscribe(data => {
    //   this.profile = data[0];
    //   this.loading = false;
    // });
    this.fs
      .collection('users')
      .doc(userName + '@mocky.com')
      .valueChanges()
      .subscribe((u: Mocker) => {
        this.profile = u;
        console.log(u);
        this.loading = false;
      });
  }

  public startConversation() {
    const isCoMocker =
      this.myProfile.coMockers &&
      this.myProfile.coMockers.find(m => m.userName === this.profile.userName);
    const obj = isCoMocker
      ? { chatId: isCoMocker.uCode }
      : { uId: this.profile.userName };

    this.router.navigate([ROUTER_LINKS.CHATS], { queryParams: obj });
  }
}
