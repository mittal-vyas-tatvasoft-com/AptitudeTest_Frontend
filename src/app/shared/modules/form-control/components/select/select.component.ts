import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { Option } from '../../interfaces/option';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;
  @Input() options: Option[] = [];

  constructor(public validationService: ValidationService) {}
}
