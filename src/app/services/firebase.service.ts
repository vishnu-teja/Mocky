import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}

  public add(path: string, item) {
    return this.db.list(path).push(item);
  }

  public update(path: string, item: any) {
    const data = JSON.parse(JSON.stringify(item));
    const key = data.key;
    delete data.key;
    return of(this.db.object(path + '/' + key).update(data));
  }

  // public delete<T>(path: string, item: any) {
  //   return this.db.object(path + '/' + item.key).remove();
  // }
}
