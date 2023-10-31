import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  currentTime!: Date;
  userName!: string;
  isSidebarOpen!: boolean;
  isAuthenticated: boolean = false;
  public mobileScreen: boolean = (window.innerWidth < 575)
  @Input() isHandset: boolean | null | undefined;
  @Output() onMenuIconClick = new EventEmitter();
  isCandidateTestRoute: boolean = false;

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
      this.userName = userData ? userData.FirstName : '';
      this.getInitials(this.userName)
    }
  }

  getInitials(firstName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    //const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    //return `${firstInitial}${lastInitial}`;
    return `${firstInitial}`;
  }

  toggleSidebar() {
    this.onMenuIconClick.emit();
    this.isSidebarOpen = !this.isSidebarOpen;
    this.loginService.saveStateToLocalStorage(this.isSidebarOpen);
  }

}
