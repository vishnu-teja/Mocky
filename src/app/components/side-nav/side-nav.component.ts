import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './../../services/user.service';
import { Mocker } from 'src/app/shared/models/user.model';
import { User } from './../../shared/models/user.model';
import { Observable } from 'rxjs';
import { DB_COLLECTIONS } from 'src/app/shared/common/app.constants';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  public loading = true;
  private myProfile: User;
  public chatList$: Observable<Mocker[]>;

  constructor(private fs: AngularFirestore, private us: UserService) {}

  ngOnInit() {
    this.myProfile = this.us.emitUserData.getValue();
    this.getChatList();
  }

  private getChatList() {
    this.chatList$ = (this.fs
      .collection(DB_COLLECTIONS.USERS)
      .doc(this.myProfile.key)
      .collection(DB_COLLECTIONS.MOCKERS, ref =>
        ref.orderBy('lastUpdated', 'desc')
      )
      .valueChanges() as Observable<Mocker[]>).pipe(
      tap(() => {
        this.loading = false;
      })
    );
  }
}
