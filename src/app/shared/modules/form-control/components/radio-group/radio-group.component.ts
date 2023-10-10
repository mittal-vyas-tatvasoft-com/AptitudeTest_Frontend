import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';
import { Option } from '../../interfaces/option';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent {
  @Input() form!: FormGroup;
  @Input() options: Option[] = [];
  @Input() formControlModel!: FormControlModel;

  constructor(public validationService: ValidationService) {}
}
