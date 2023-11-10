import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { LoginService } from '../../auth/services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../auth/components/change-password/change-password.component';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  currentTime!: Date;
  userName!: string;
  email: string;
  isSidebarOpen!: boolean;
  isAuthenticated: boolean = false;
  public mobileScreen: boolean = window.innerWidth < 575;
  @Input() isHandset: boolean | null | undefined;
  @Output() onMenuIconClick = new EventEmitter();
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private loginService: LoginService,
    public dialog: MatDialog,
    public snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.loginService.isLoggedIn();
    this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
    this.getUserData();
    this.updateTime();
    this.getUserEmail();
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
    }
  }

  getUserEmail() {
    const token = this.loginService.getToken();
    if (token) {
      const userData = this.loginService.decodeToken();
      this.email = userData ? userData.Email : '';
    }
  }

  toggleSidebar() {
    this.onMenuIconClick.emit();
    this.isSidebarOpen = !this.isSidebarOpen;
    this.loginService.saveStateToLocalStorage(this.isSidebarOpen);
  }

  chanegPasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(ChangePasswordComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data != null) {
          const payload = {
            email: this.email,
            currentPassword: data.currentPasswordField,
            newPassword: data.newPasswordField,
            confirmPassword: data.confirmPasswordField,
          };
          this.loginService
            .changePassword(payload)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                debugger;
                if (res.statusCode === StatusCode.Success) {
                  this.snackbar.success(res.message);
                } else {
                  this.snackbar.error('error');
                }
              },
            });
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
