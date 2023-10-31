import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginModel } from '../../interfaces/login.interface';
import { loginControl } from '../../configs/login.config';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { validations } from 'src/app/shared/messages/validation.static';
import { Navigation } from 'src/app/shared/common/enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loginModel = loginControl;
  public passwordHide: boolean = true;
  public isLoggingIn: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      userName: ['', [
        Validators.required,
        Validators.pattern(validations.common.emailREGEX),
      ],],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.valid) {
      this.isLoggingIn = true;
      const payload = {
        email: this.form.value.userName,
        password: this.form.value.password,
      };
      this.loginService
        .login(payload)
        .pipe(takeUntil(this.ngUnsubscribe$),
          finalize(() => {
            this.isLoggingIn = false;
          }))
        .subscribe({
          next: (res: ResponseModel<string>) => {
            if (res.result) {
              this.snackbarService.success(res.message);
              this.router.navigate([
                `${Navigation.Admin}`,
              ]);
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (error: { message: string; }) => {
            this.snackbarService.error(error.message);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onIconClick(event: any) {
    if (event.formControlModel.inputType == 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}