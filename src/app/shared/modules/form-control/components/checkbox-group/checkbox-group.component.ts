import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';
import { Option } from '../../interfaces/option';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;
  @Input() options: Option[] = [];
  checkboxValues: number[] = [];

  constructor(public validationService: ValidationService) {}

  checkboxChanged(event: any) {
    this.form.get(this.formControlModel.key)?.markAsTouched();
    if (event.checked) {
      this.checkboxValues.push(Number(event.source.value));
    } else {
      const index = this.checkboxValues.indexOf(Number(event.source.value));
      this.checkboxValues.splice(index, 1);
    }
    this.form.get(this.formControlModel.key)?.setValue(this.checkboxValues);
    if (this.checkboxValues.length == 0) {
      this.form.get(this.formControlModel.key)?.setValue('');
    }
  }
}
