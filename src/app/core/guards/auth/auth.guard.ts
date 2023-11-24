import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { Observable } from 'rxjs';
import { Navigation } from 'src/app/shared/common/enums';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
