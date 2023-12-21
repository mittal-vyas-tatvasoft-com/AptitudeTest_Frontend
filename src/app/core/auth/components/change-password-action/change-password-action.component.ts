import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Messages } from 'src/app/shared/messages/messages.static';
import { validations } from 'src/app/shared/messages/validation.static';
import { FormControlModel } from 'src/app/shared/modules/form-control/interfaces/form-control-model';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { changePasswordControl } from '../../configs/change-password.config';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-change-password-action',
  templateUrl: './change-password-action.component.html',
  styleUrls: ['./change-password-action.component.scss'],
})
export class ChangePasswordActionComponent implements OnInit {
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
    this.form = this.fb.group({
      passwordField: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.passwordREGEX),
        ],
      ],
    });
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
    this.formControls.PasswordField.inputType = 'password';
    this.formControls.PasswordField.iconName =
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
}
