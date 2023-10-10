import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { validations } from 'src/app/shared/messages/validation.static';
import { LoginService } from '../../services/login.service';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { forgotControl } from '../../configs/forgot-password.config';

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
    private forgotPasswordService: LoginService, // Use the service
    private router: Router,
  ) {}

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
        userName: this.form.value.userName,
      };

      this.disable = true;

      this.forgotPasswordService
      .forgotPassword(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<string>) => {
          if (res.result) {
            if (res.statusCode === 200) {
              this.router.navigate(['/reset-password']);
            }
          } else {
            this.forgotFailed = true;
            console.error(`Password reset failed: ${res.message}`);
          }
          this.disable = false;
        },
        error: () => {
          this.forgotFailed = true;
          console.error('An error occurred while resetting the password.');
          this.disable = false;
        },
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
