import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { changePasswordControl } from '../../configs/change-password.config';
import { MatDialogRef } from '@angular/material/dialog';
import { AddDegreeComponent } from 'src/app/modules/masters/degree/components/add-degree/add-degree.component';
import { validations } from 'src/app/shared/messages/validation.static';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formControls = changePasswordControl;

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
      { validators: [repeatPasswordValidator] } as AbstractControlOptions
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
    if (event.formControlModel.inputType == 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
    }
  }
}
export const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('newPasswordField')?.value;
  const cpwd = control.get('confirmPasswordField')?.value;
  if (pwd === cpwd) {
    control.get('confirmPasswordField')?.setErrors(null);
    return null;
  } else {
    control.get('confirmPasswordField')?.setErrors({ confirmPassword: true });
    return { confirmPassword: true };
  }
};
