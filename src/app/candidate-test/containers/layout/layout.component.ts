import { Component, HostListener } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private loginService: LoginService) {}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    var role = this.loginService.getUserRole();
    if (role !== 'Admin') {
      if (event.key === 'F12' || event.keyCode === 123) {
        event.preventDefault();
      }
    }
  }

  preventRightClick(event: MouseEvent): void {
    var role = this.loginService.getUserRole();
    if (role !== 'Admin') {
      event.preventDefault();
    }
  }
}
