import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { ROUTER_LINKS } from './../shared/common/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private af: AngularFireAuth, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.af.authState.pipe(take(1)).subscribe((user: any) => {
      if (!user) {
        this.router.navigate([ROUTER_LINKS.SIGN_IN]);
        return false;
      } else {
        return true;
      }
    });

    return true;
  }
}
