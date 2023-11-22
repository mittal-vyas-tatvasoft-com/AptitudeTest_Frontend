import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { loginControl } from '../../configs/login.config';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ActivatedRoute, Router } from '@angular/router';
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
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
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
  }

  login() {
    if (this.form.valid) {
      const payload = {
        email: this.form.value.userName,
        password: this.form.value.password,
      };
      this.loginModel.passwordField.inputType = 'password';
      this.loginModel.passwordField.iconName = 'password-visibility-show-dark.svg';
      this.loginService
        .login(payload)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: ResponseModel<string>) => {
            if (res.result) {
              const data = this.loginService.decodeToken();
              if (data.Role === 'Admin') {
                this.router.navigate([`${Navigation.Admin}`]);
              } else {
                this.router.navigate([`${Navigation.CandidateUser}`]);
              }
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (error: { message: string }) => {
            this.snackbarService.error(error.message);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onIconClick(formControlModel: FormControlModel) {
    if (formControlModel.inputType === 'text') {
      formControlModel.inputType = 'password';
      formControlModel.iconName = 'password-visibility-show-dark.svg';
    } else {
      formControlModel.inputType = 'text';
      formControlModel.iconName = 'password-visibility-hide-dark.svg';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
