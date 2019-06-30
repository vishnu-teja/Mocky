import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore } from '@angular/fire/firestore';
import { NzNotificationService } from 'ng-zorro-antd';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private afs: AngularFirestore,
    private notification: NzNotificationService,
    private route: Router
  ) {
    this.angularFireMessaging.messaging.subscribe(messaging => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
  }

  updateToken(token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe((user: any) => {
      if (!user) {
        return;
      }

      this.afs
        .collection('/fcmTokens')
        .doc(user.uid)
        .collection('tokens')
        .doc(token)
        .set({ token });
    });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      token => {
        console.log(token);
        this.updateToken(token);
      },
      err => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      if (payload.notification.click_action !== this.route.url) {
        this.currentMessage.next(payload);
      }
      // this.notification.info(
      //   payload.notification.title,
      //   payload.notification.body
      // );
    });
  }
}
