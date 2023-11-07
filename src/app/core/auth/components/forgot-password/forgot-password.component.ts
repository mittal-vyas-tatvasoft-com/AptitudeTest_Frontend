import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { validations } from 'src/app/shared/messages/validation.static';
import { LoginService } from '../../services/login.service';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { forgotControl } from '../../configs/forgot-password.config';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {

  form!: FormGroup;
  disable = false;
  forgotModel = forgotControl;
  forgotFailed = false;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService, // Use the service
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.emailREGEX),
        ],
      ],
    });
  }

  onForgot() {
    if (this.form.valid) {
      const data = {
        Email: this.form.value.userName,
      };

      this.disable = true;

      this.loginService
        .forgotPassword(data)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: ResponseModel<string>) => {
            if (res.result) {
              this.snackbarService.success(res.message);
              this.router.navigate(['/reset-password']);
            } else {
              this.forgotFailed = true;
              this.snackbarService.error(res.message);
              this.disable = false;
            }
          },
          error: (error) => {
            this.forgotFailed = true;
            this.snackbarService.error(error.message);
            this.disable = false;
          },
        });
    }
  }

  // if (this.form.valid) {
  //   const data = {
  //     userName: this.form.value.userName,
  //   };

  //   this.disable = true;

  //   this.forgotPasswordService
  //   .forgotPassword(data)
  //   .pipe(takeUntil(this.ngUnsubscribe$))
  //   .subscribe({
  //     next: (res: ResponseModel<string>) => {
  //       if (res.result) {
  //         if (res.statusCode === 200) {
  //           this.router.navigate(['/reset-password']);
  //         }
  //       } else {
  //         this.forgotFailed = true;
  //       }
  //       this.disable = false;
  //     },
  //     error: () => {
  //       this.forgotFailed = true;
  //       this.disable = false;
  //     },
  //   });
  // }


  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
