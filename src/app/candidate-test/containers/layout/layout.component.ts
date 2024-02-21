import { Component, HostListener } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private loginService: LoginService) {}

  getRole(): boolean {
    var role = this.loginService.getUserRole();
    if (role === 'Admin') {
      return true;
    } else {
      return false;
    }
  }
}
