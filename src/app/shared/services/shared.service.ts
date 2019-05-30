import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public toggleSideNav = new EventEmitter();

  constructor() {}
}
