import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isAuthenticated: boolean = false;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.loginService.isLoggedIn();
  }

  @Input() isHandset: boolean | null | undefined;
  @Output() onMenuIconClick = new EventEmitter();

  logout(): void {
    this.loginService.logout();
    this.isAuthenticated = false;
  }
  onClick() {
    this.onMenuIconClick.emit();
  }

}
