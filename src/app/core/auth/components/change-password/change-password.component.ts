import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { changePasswordControl } from '../../configs/change-password.config';
import { MatDialogRef } from '@angular/material/dialog';
import { AddDegreeComponent } from 'src/app/modules/masters/degree/components/add-degree/add-degree.component';
import { validations } from 'src/app/shared/messages/validation.static';
import { Messages } from 'src/app/shared/messages/messages.static';

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
    public dialogRef: MatDialogRef<AddDegreeComponent>
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
    this.dialogRef.close();
  }

  onIconClick(event: any) {
    if (event.formControlModel.inputType === 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
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
