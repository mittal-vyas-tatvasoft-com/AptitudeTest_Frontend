import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree,
} from '@angular/router';
import { LoginService } from '../../auth/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.loginService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
