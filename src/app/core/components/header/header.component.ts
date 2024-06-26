import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { ChangePasswordComponent } from '../../auth/components/change-password/change-password.component';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTime!: Date;
  userName!: string;
  email: string;
  isSidebarOpen!: boolean;
  isAuthenticated = false;
  isAdmin = false;
  userId = 0;
  isSuperAdmin = false;
  role: string | null;
  public mobileScreen: boolean = window.innerWidth < 575;
  @Input() register: boolean;
  @Input() isHandset: boolean | null | undefined;
  @Output() menuIconClickEvent = new EventEmitter();
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private loginService: LoginService,
    public dialog: MatDialog,
    public snackbar: SnackbarService,
    private router: Router,
    private candidateTestService: CandidateTestService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.loginService.isLoggedIn();
    this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
    this.getUserData();
    this.updateTime();
    this.getUserEmail();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    this.getRole();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileScreen = window.innerWidth < 575;
  }

  logout(): void {
    this.loginService.logout();
    this.isAuthenticated = false;
  }

  getRole() {
    if (!this.register) {
      this.role = this.loginService.getUserRole();
      if (this.role === 'Admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

  onClick() {
    this.menuIconClickEvent.emit();
  }

  updateTime() {
    this.currentTime = new Date();
  }

  getUserData() {
    const userData = this.loginService.decodeToken();
    if (userData) {
      this.userName = userData ? userData.FirstName : '';
      this.isSuperAdmin = userData?.IsSuperAdmin === 'true';
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
    this.menuIconClickEvent.emit();
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

  MyProfile() {
    const userData = this.loginService.decodeToken();
    if (userData) {
      this.userId = +userData.Id;
    }
    if (this.userId != 0) {
      this.router.navigate(['edit', this.userId]);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
