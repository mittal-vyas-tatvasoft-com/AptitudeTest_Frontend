import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { Navigation } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  constructor(private loginService: LoginService, private router: Router) {}

  determineRole() {
    const data = this.loginService.decodeToken();
    const isLoggedIn = this.loginService.isLoggedIn();
    if (isLoggedIn) {
      if (data.Role === Navigation.RoleAdmin) {
        this.router.navigate(['admin/candidate']);
      } else {
        this.router.navigate(['user']);
      }
    } else {
      this.router.navigate(['']);
    }
  }
}
