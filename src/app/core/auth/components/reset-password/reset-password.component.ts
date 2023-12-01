import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { resetPasswordControl } from '../../configs/reset-password.config';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  disable = false;
  resetModel = resetPasswordControl;
  resetFailed = false;
  passwordsDoNotMatch = false;
  encryptedEmail!: string;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.encryptedEmail = params['email'];
    });
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  resetPassword() {
    const payload = {
      newPassword: this.form.value.newPassword,
      encryptedEmail: this.encryptedEmail,
    };
    if (this.form.valid) {
      this.disable = true;
      this.loginService
        .resetPassword(payload)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: ResponseModel<string>) => {
            if (res.result) {
              this.snackbarService.success(res.message);
              this.form.reset();
              this.router.navigate(['/']);
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (error) => {
            this.snackbarService.error(error.message);
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
