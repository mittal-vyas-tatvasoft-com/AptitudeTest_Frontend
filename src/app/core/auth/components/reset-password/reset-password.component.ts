import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { validations } from 'src/app/shared/messages/validation.static';
import { forgotControl } from '../../configs/forgot-password.config';
import { resetPasswordControl } from '../../configs/reset-password.config';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {

  form!: FormGroup;
  disable = false;
  resetModel = resetPasswordControl;
  resetFailed = false;
  passwordsDoNotMatch: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: LoginService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
        ],
      ]
    } ,{ validators: this.passwordsMatchValidator });
  }

  resetPassword() {
    if (this.form.valid) {
      const data = {
        newPassword: this.form.value.newPassword,
      };

      this.disable = true;

      this.resetPasswordService
      .resetPassword(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<string>) => {
          if (res.result) {
            if (res.statusCode === 200) {
              this.router.navigate(['']);
            }
          } else {
            this.resetFailed = true;
            console.error(`Password reset failed: ${res.message}`);
          }
          this.disable = false;
        },
        error: () => {
          this.resetFailed = true;
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

  onIconClick(event: any) {
    if (event.formControlModel.inputType == 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
    }
  }

  private passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    if (newPassword === confirmPassword) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
}