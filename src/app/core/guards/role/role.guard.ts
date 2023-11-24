import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../auth/services/login.service';
import { Navigation } from 'src/app/shared/common/enums';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private roleGuardService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles = route.data['allowedRoles'] as string[];

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = this.roleGuardService.getUserRole();

      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      } else {
        const data = this.roleGuardService.getUserRole();
        if (data == Navigation.RoleAdmin) {
          this.roleGuardService.logout();
          this.router.navigate([`${Navigation.AdminLogin}`]);
        }
        else {
          this.roleGuardService.logout();
          this.router.navigate([`/`]);
        }
        return false;
      }
    }
    return true;
  }
}
