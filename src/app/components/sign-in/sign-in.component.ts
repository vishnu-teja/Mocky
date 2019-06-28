import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import {
  DB_COLLECTIONS,
  SESSION_DATA,
  ROUTER_LINKS
} from 'src/app/shared/common/app.constants';
import { NzNotificationService } from 'ng-zorro-antd';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserForm, User } from './../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public isUser = true;
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private us: UserService,
    private notification: NzNotificationService,
    private fs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.validateForm = this.fb.group({
      fullName: [null, Validators.compose([Validators.required])],
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    const nameField = this.validateForm.get('fullName');
    this.isUser
      ? nameField.setValidators(null)
      : nameField.setValidators([Validators.required]);
  }

  public switchForm() {
    this.isUser = !this.isUser;
    this.createForm();
  }

  submitForm(): void {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const user: UserForm = this.validateForm.value;

    if (user.fullName) {
      this.signUp(user);
    } else {
      this.getUser(user);
    }
  }

  private signUp(user: UserForm) {
    const email = user.userName + '@mocky.com';

    const newUser: User = {
      fullName: user.fullName,
      userName: user.userName,
      mockMail: email,
      imageLink: 'https://image.flaticon.com/icons/png/128/149/149071.png'
    };
    this.us
      .createUserWithEmail(email, user.password)
      .then(data => {
        newUser.key = data.user.uid;
        this.addNewUser(newUser);
      })
      .catch(err => {
        this.notification.error('Error', err);
      });
  }

  addNewUser(user: User) {
    this.fs
      .collection('/users')
      .doc(user.key)
      .set(user)
      .then(() => {
        this.setInSession(user);
      });
  }

  getUser(user: UserForm) {
    const email = user.userName + '@mocky.com';
    this.us
      .signInWithEmail(email, user.password)
      .then(result => {
        this.fs
          .collection(DB_COLLECTIONS.USERS, ref =>
            ref.where('userName', '==', user.userName)
          )
          .valueChanges()
          .subscribe(data => {
            console.log(data);
            this.setInSession(data[0]);
          });
      })
      .catch(err => {});
  }

  setInSession(user) {
    sessionStorage.setItem(SESSION_DATA.USER, JSON.stringify(user));
    this.us.emitUserData.next(user);
    this.router.navigate([ROUTER_LINKS.CHATS]);
  }
}
