import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordGuard {
  OffCampusMode: boolean;
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.loginService.isFirstLoggedIn){
      this.router.navigate(['404']);
      return false;
    }
return true;
  }
}
