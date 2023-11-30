import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Navigation } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { validations } from 'src/app/shared/messages/validation.static';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { loginControl } from '../../configs/login.config';
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
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
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

  login() {
    if (this.form.valid) {
      const payload = {
        email: this.form.value.userName,
        password: this.form.value.password,
      };
      this.loginModel.passwordField.inputType = 'password';
      this.loginModel.passwordField.iconName =
        'password-visibility-show-dark.svg';
      if (this.isAdmin) {
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
      } else {
        this.loginService
          .login(payload)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res: ResponseModel<string>) => {
              if (res.result) {
                this.router.navigate([`${Navigation.CandidateUser}`]);
              } else {
                this.snackbarService.error(res.message);
              }
            },
            error: (error: { message: string }) => {
              this.snackbarService.error(error.message);
            },
          });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  isRouteAdmin(route: ActivatedRoute | null): any {
    const decodedToken = this.loginService.decodeToken();
    if (decodedToken) {
      return decodedToken.Role === Navigation.RoleAdmin ? true : false;
    } else {
      return route &&
        route.snapshot.url.some((segment) => segment.path === 'login')
        ? true
        : false;
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
