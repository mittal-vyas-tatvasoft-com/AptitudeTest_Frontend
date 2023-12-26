import { Injectable } from '@angular/core';
import { Messages } from 'src/app/shared/messages/messages.static';
import { FormControlModel } from '../interfaces/form-control-model';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  getError(form: any, formControlModel: FormControlModel, field: string) {
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
        if (formControl.errors['confirmPassword']) {
          return formControlModel.patternErrMsg;
        }
        if (formControl.errors['newPassword']) {
          return Messages.samePasswordError;
        }
        if (formControl.errors['max']) {
          return formControlModel.maxErrMsg;
        }
        if (formControl.errors['min']) {
          return formControlModel.minErrMsg;
        }
        if (formControl.errors['characterOnly']) {
          return formControlModel.characterOnlyMsg;
        }
      }
    }
    return null;
  }
}
