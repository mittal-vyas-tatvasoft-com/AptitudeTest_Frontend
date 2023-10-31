import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  currentTime: Date;
  userName: string;
  firstName: string;
  lastName: string;
  isSidebarOpen!: boolean;
  isAuthenticated: boolean = false;
  public mobileScreen: boolean = (window.innerWidth < 575)
  @Input() isHandset: boolean | null | undefined;
  @Output() onMenuIconClick = new EventEmitter();

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.loginService.isLoggedIn();
    this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
    this.getUserData();
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileScreen = window.innerWidth < 575;
  }

  logout(): void {
    this.loginService.logout();
    this.isAuthenticated = false;
  }

  onClick() {
    this.onMenuIconClick.emit();
  }

  updateTime() {
    this.currentTime = new Date();
  }

  getUserData() {
    const token = this.loginService.getToken();
    if (token) {
      const userData = this.loginService.decodeToken();
      console.log(userData)
      this.userName = userData ? userData.FirstName + ' ' + userData.LastName : '';
      this.firstName = userData ? userData.FirstName : '';
      this.lastName = userData ? userData.LastName : '';
      this.getInitials(this.firstName, this.lastName)
    }
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  toggleSidebar() {
    this.onMenuIconClick.emit();
    this.isSidebarOpen = !this.isSidebarOpen;
    this.loginService.saveStateToLocalStorage(this.isSidebarOpen);
  }
}