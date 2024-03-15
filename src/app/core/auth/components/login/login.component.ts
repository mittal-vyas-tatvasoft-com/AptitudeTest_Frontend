import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SettingService } from 'src/app/modules/setting/services/setting.service';
import { Navigation } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { validations } from 'src/app/shared/messages/validation.static';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { loginControl } from '../../configs/login.config';
import { TokenWithSidVm } from '../../interfaces/login.interface';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginModel = loginControl;
  isAdmin = false;
  OffCampusMode: boolean;
  rememberMe = false;
  mobileDeviceErrMsg = 'Login is not allowed in Mobile device';
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private settingService: SettingService
  ) {}

  ngOnInit() {
    this.settingService.get().subscribe({
      next: (res) => {
        this.OffCampusMode = res.data.userRegistration;
      },
    });
    this.isAdmin = this.isRouteAdmin(this.activatedRoute);
    this.form = this.formBuilder.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.emailREGEX),
        ],
      ],
      password: ['', [Validators.required]],
    });
    this.getToken();
  }

  doAdminLogin(payload: any) {
    this.loginService
      .Adminlogin(payload)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<string>) => {
          if (res.result) {
            this.router.navigate([`${Navigation.Admin}`]);
          } else {
            this.snackbarService.error(res.message);
          }
        },
        error: (error: { message: string }) => {
          this.snackbarService.error(error.message);
        },
      });
  }

  doUserLogin(payload: any) {
    if (window.screen.width <= 960 && screen.availWidth <= 960) {
      this.snackbarService.error(this.mobileDeviceErrMsg);
      return;
    }
    this.loginService
      .login(payload)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<TokenWithSidVm>) => {
          if (res.result) {
            this.loginService.setSubmitted(
              res.data.isSubmitted ? 'true' : 'false'
            );
            this.loginService.setProfileEdited(
              res.data.isProfileEdited ? 'true' : 'false'
            );
            const token = this.loginService.decodeToken();
            if (res.data.isSubmitted) {
              this.router.navigate([`user/${Navigation.Submitted}`]);
            } else if (res.data.isProfileEdited) {
              if (res.data.isStarted) {
                this.router.navigate([
                  `${Navigation.CandidateUser}/${Navigation.Instructions}`,
                ]);
              } else {
                this.router.navigate([`${Navigation.CandidateUser}`]);
              }
            } else {
              this.router.navigate([`${Navigation.Edit}/${token.Id}`]);
            }
          } else {
            this.snackbarService.error(res.message);
          }
        },
        error: (error: { message: string }) => {
          this.snackbarService.error(error.message);
        },
      });
  }

  login() {
    if (this.form.valid) {
      this.loginService.saveRememberMe(this.rememberMe);

      const payload = {
        email: this.form.value.userName,
        password: this.form.value.password,
      };
      this.loginModel.passwordField.inputType = 'password';
      this.loginModel.passwordField.iconName =
        'password-visibility-show-dark.svg';
      if (this.isAdmin) {
        this.doAdminLogin(payload);
      } else {
        this.doUserLogin(payload);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  isRouteAdmin(route: ActivatedRoute | null): any {
    const decodedToken = this.loginService.decodeToken();
    if (decodedToken) {
      return decodedToken.Role === Navigation.RoleAdmin;
    } else {
      return route?.snapshot.url.some((segment) => segment.path === 'login');
    }
  }

  onIconClick(event: any) {
    if (event.inputType === 'text') {
      event.inputType = 'password';
      this.loginModel.passwordField.iconName =
        'password-visibility-show-dark.svg';
    } else {
      event.inputType = 'text';
      this.loginModel.passwordField.iconName =
        'password-visibility-hide-dark.svg';
    }
  }

  getToken() {
    const data = this.loginService.getToken();
    if (data) {
      if (
        (this.activatedRoute.snapshot.url.length === 0 ||
          this.activatedRoute.snapshot.url.some(
            (segment) => segment.path === 'login'
          )) &&
        this.isAdmin
      ) {
        this.router.navigate([`${Navigation.Admin}`]);
      } else {
        this.router.navigate([`${Navigation.CandidateUser}`]);
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
