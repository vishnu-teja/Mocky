import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from './../../../shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  ngOnInit() {}
}
