import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';
import { SelectOption } from '../../interfaces/select-option.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() formControlModel: FormControlModel;
  @Input() form: FormGroup;
  @Input() options: SelectOption[] | null = [];
  @Output() selection = new EventEmitter();
  constructor(public _validator: ValidationService) {}

  getOptions() {
    const formControlModel = this.options;
    if (formControlModel) {
      return formControlModel;
    }

    return [];
  }
}
