import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { Option } from '../../interfaces/option';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;
  @Input() options: Option[] = [];

  constructor(public validationService: ValidationService) {}
}
