import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './core/auth/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Aptitude_test';
  subscription: Subscription;
  route: boolean;

  constructor(private router: Router, private loginService: LoginService) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        debugger;
        this.route = !router.navigated;
      }
    });
  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(): void {
  //   const token = this.loginService.decodeToken();
  //   if (token && token?.Role === Navigation.RoleUser && !this.route) {
  //     const email = token.Email;
  //     this.loginService.removeToken(email).subscribe({
  //       next: (res: any) => {
  //         if (res.statusCode === StatusCode.Success) {
  //           this.loginService.logout();
  //         }
  //       },
  //     });
  //   }
  // }
}
