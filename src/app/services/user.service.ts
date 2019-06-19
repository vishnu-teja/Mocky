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

  public logout() {
    return this.afAuth.auth.signOut();
  }
}
