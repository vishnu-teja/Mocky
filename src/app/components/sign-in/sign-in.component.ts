import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import {
  DB_COLLECTIONS,
  SESSION_DATA
} from 'src/app/shared/common/app.constants';
import { NzNotificationService } from 'ng-zorro-antd';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private us: UserService,
    private notification: NzNotificationService,
    private fs: AngularFirestore
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const user: any = this.validateForm.value;

    if (user.name) {
      this.signUp(user);
    } else {
      this.getUser(user);
    }
  }

  private signUp(user: any) {
    const email = user.userName + '@mocky.com';
    this.us
      .createUserWithEmail(email, user.password)
      .then(data => {
        console.log(data);
        user.key = data.user.uid;
        this.addNewUser(user);
      })
      .catch(err => {
        this.notification.error('Error', err);
      });
  }

  addNewUser(user) {
    // this.us.addUser(DB_COLLECTIONS.USERS, user).then(data => {
    //   console.log(data);

    //   user.key = data.key;

    //   this.setInSession(user);
    // });
    delete user.password;
    this.fs
      .collection('/users')
      .doc(user.userName + '@mocky.com')
      .set(user)
      .then(res => {
        console.log(res);
        this.setInSession(user);
      });
  }

  getUser(user) {
    // this.us.getUser(DB_COLLECTIONS.USERS, user.userName).subscribe(data => {
    //   console.log(data);
    //   this.setInSession(data);
    // });

    this.us
      .signInWithEmail(user.userName + '@mocky.com', user.password)
      .then(data => {
        console.log(data);
      });

    this.fs
      .collection('/users')
      .doc(user.userName + '@mocky.com')
      .valueChanges()
      .subscribe(data => {
        console.log(data);
      });
  }

  setInSession(user) {
    sessionStorage.setItem(SESSION_DATA.USER, JSON.stringify(user));
    this.us.emitUserData.next(user);
  }
}
