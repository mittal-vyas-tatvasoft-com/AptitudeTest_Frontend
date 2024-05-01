import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { changePasswordControl } from '../../configs/change-password.config';
import { Messages } from 'src/app/shared/messages/messages.static';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { validations } from 'src/app/shared/messages/validation.static';
import { FormControlModel } from 'src/app/shared/modules/form-control/interfaces/form-control-model';
import { LoginService } from '../../services/login.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StatusCode } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss']
})
export class ChangeUserPasswordComponent {
  form: FormGroup;
  formControls = changePasswordControl;
  message = Messages.passwordPattern;
email:string
  constructor(
    public validation: ValidationService,
    private fb: FormBuilder,
    private loginService:LoginService,
    private snackbarService:SnackbarService
  ) {}

  
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group(
      {
        currentPasswordField: ['', [Validators.required]],
        newPasswordField: [
          '',
          [
            Validators.required,
            Validators.pattern(validations.common.passwordREGEX),
          ],
        ],
        confirmPasswordField: ['', [Validators.required]],
      },
      { validator: [this.checkNewPasswords,this.checkConfirmPassword] } as AbstractControlOptions
    );
  }

  onSaveClick() {
    this.getUserEmail()
    if (this.form.valid) {
      let data=this.form.value
      const payload = {
        email: this.email,
        currentPassword: data.currentPasswordField,
        newPassword: data.newPasswordField,
        confirmPassword: data.confirmPasswordField,
      };
      this.loginService.changeUserPassword(payload).subscribe({
        next: (res) => {
          if (res.statusCode === StatusCode.Success) {
            this.loginService.logout();
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
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

  checkNewPasswords(group: FormGroup) {
    const currentPassword = group.controls['currentPasswordField'];
    const newPassword = group.controls['newPasswordField'];

    if (currentPassword.value !== '') {
        if (currentPassword.value === newPassword.value) {
          group.get('newPasswordField')?.setErrors({ newPassword: true });
          return { newPassword: true };
        } 
        else{
          group.get('newPasswordField')?.setErrors({ newPassword: null });
          return null;
        }
    } else {
      return null;
    }
  }

  checkConfirmPassword(group: FormGroup) {
    const newPassword = group.controls['newPasswordField'];
    const confirmPassword = group.controls['confirmPasswordField'];
    if (newPassword.value != confirmPassword.value) {
      group.get('confirmPasswordField')?.setErrors({ confirmPassword: true });
      return { confirmPassword: true };
    }
    else{
      group.get('confirmPasswordField')?.setErrors({ confirmPassword: null });
      return null;
    }
  }

  getUserEmail() {
    const token = this.loginService.getToken();
    if (token) {
      const userData = this.loginService.decodeToken();
      this.email = userData ? userData.Email : '';
    }
  }

}
