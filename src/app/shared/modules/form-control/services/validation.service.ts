import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../interfaces/form-control-model';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  getError(form: FormGroup, formControlModel: FormControlModel, field: string) {
    const formControl = form.get(field);
    if (formControl) {
      if (formControl.touched && formControl.errors) {
        if (formControl.errors['required']) {
          return formControlModel.requiredErrMsg;
        }
        if (formControl.errors['pattern']) {
          return formControlModel.patternErrMsg;
        }
        if (formControl.errors['maxlength']) {
          return formControlModel.maxLengthErrMsg;
        }
        if (formControl.errors['minlength']) {
          return formControlModel.minLengthErrMsg;
        }
      }
    }
    return null;
  }
}
