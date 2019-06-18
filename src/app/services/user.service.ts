import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { SESSION_DATA } from '../shared/common/app.constants';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public emitUserData = new BehaviorSubject(null);
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private fs: FirebaseService
  ) {
    const user = JSON.parse(sessionStorage.getItem(SESSION_DATA.USER));
    if (user) {
      this.emitUserData.next(user);
    }
  }

  public signInWithEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public createUserWithEmail(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public signOut() {
    return this.afAuth.auth.signOut();
  }

  addUser(path: string, user) {
    return this.fs.add(path, user);
  }

  getUser(path: string, userName) {
    return (
      this.db
        // .list(path, ref => ref.orderByKey().equalTo('-Lh4mGRfU0LscsdT5jho'))
        .list(path, ref => ref.orderByChild('userName').equalTo(userName))
        .snapshotChanges()
        .pipe(
          map((data: any) => {
            console.log(data);
            return data.map((d: any) => {
              return {
                key: d.key,
                ...d.payload.val()
              };
            });
          })
        )
    );
  }

  updateUser(path, userData) {
    const user = JSON.parse(JSON.stringify(userData));
    const key = user.key;
    delete user.key;
    return of(this.db.object(path + key).update(user));
  }

  getUserByText(path, searchText) {
    return this.db
      .list(path, ref =>
        ref
          .orderByChild('userName')
          .startAt(searchText)
          .endAt(searchText + '\uf8ff')
      )
      .snapshotChanges()
      .pipe(
        map(data => {
          console.log(data);
          return data.map((d: any) => {
            return {
              key: d.key,
              ...d.payload.val()
            };
          });
        })
      );
  }
}
