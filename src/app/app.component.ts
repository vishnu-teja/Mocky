import { Component, OnInit } from '@angular/core';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private nf: NotificationService) {}

  ngOnInit() {
    this.nf.requestPermission();
    this.nf.receiveMessage();
  }
}
