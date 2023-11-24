import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { loginControl } from '../../configs/login.config';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { validations } from 'src/app/shared/messages/validation.static';
import { Navigation } from 'src/app/shared/common/enums';
import { FormControlModel } from 'src/app/shared/modules/form-control/interfaces/form-control-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loginModel = loginControl;
  isAdmin: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) { }

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
      password: ['', [Validators.required,
      Validators.pattern(validations.common.passwordREGEX)]],
    });
    this.getToken()
  }

  login() {
    if (this.form.valid) {
      const payload = {
        email: this.form.value.userName,
        password: this.form.value.password,
      };
      this.loginModel.passwordField.inputType = 'password';
      this.loginModel.passwordField.iconName = 'password-visibility-show-dark.svg';
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
      }
      else {
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
    if (!route) {
      return false;
    }
    if (route.snapshot.url.some(segment => segment.path === 'login')) {
      return true;
    }
  }

  onIconClick(event: any) {
    if (event.formControlModel.inputType == 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
    }
  }

  getToken() {
    const data = this.loginService.getToken();
    if (data) {
      if (this.isAdmin) {
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
