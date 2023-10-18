import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  public mobileScreen: boolean = (window.innerWidth < 575)
  constructor(private loginService: LoginService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileScreen = window.innerWidth < 575;
  }

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

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

}
