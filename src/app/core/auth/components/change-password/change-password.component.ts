import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Messages } from 'src/app/shared/messages/messages.static';
import { validations } from 'src/app/shared/messages/validation.static';
import { FormControlModel } from 'src/app/shared/modules/form-control/interfaces/form-control-model';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { changePasswordControl } from '../../configs/change-password.config';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formControls = changePasswordControl;
  message = Messages.passwordPattern;

  constructor(
    public validation: ValidationService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>
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
      { validator: this.checkPasswords }
    );
  }

  onSaveClick() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  closeModal() {
    this.resetPasswordVisibility();
    this.dialogRef.close();
  }

  private resetPasswordVisibility() {
    this.formControls.currentPasswordField.inputType = 'password';
    this.formControls.currentPasswordField.iconName =
      'password-visibility-show-dark.svg';

    this.formControls.newPasswordField.inputType = 'password';
    this.formControls.newPasswordField.iconName =
      'password-visibility-show-dark.svg';

    this.formControls.confirmPasswordField.inputType = 'password';
    this.formControls.confirmPasswordField.iconName =
      'password-visibility-show-dark.svg';
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
  checkPasswords(group: FormGroup) {
    const currentPassword = group.controls['currentPasswordField'];
    const newPassword = group.controls['newPasswordField'];
    const confirmPassword = group.controls['confirmPasswordField'];
    if (currentPassword.value !== '') {
      if (currentPassword.value === newPassword.value) {
        group.get('newPasswordField')?.setErrors({ newPassword: true });
        return { newPassword: true };
      }
      if (newPassword.value === confirmPassword.value) {
        return null;
      } else {
        group.get('confirmPasswordField')?.setErrors({ confirmPassword: true });
        return { confirmPassword: true };
      }
    } else {
      return null;
    }
  }
}
