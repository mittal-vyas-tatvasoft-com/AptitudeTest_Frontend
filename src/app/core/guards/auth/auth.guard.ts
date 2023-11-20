import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    if (this.loginService.isLoggedIn()) {
      const userRole = this.loginService.getUserRole();
      if (!userRole) {
        return this.router.createUrlTree(['/']);
      }
      if (state.url.startsWith('/admin') && userRole !== 'Admin') {
        return this.router.createUrlTree(['/']);
      }
      if (state.url.startsWith('/user') && userRole !== 'User') {
        return this.router.createUrlTree(['/']);
      }
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
