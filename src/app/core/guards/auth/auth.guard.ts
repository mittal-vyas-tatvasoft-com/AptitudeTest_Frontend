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
      const userRole = this.loginService.getUserRole();
      if (!userRole) {
        return this.router.createUrlTree(['/']);
      }
      if (state.url.startsWith('/admin') && userRole !== Navigation.RoleAdmin) {
        return this.router.createUrlTree(['/']);
      }
      if (state.url.startsWith('/user') && userRole !== Navigation.RoleUser) {
        return this.router.createUrlTree([Navigation.AdminLogin]);
      }
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
