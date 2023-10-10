import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-text-control-number',
  templateUrl: './text-control-number.component.html',
  styleUrls: ['./text-control-number.component.scss'],
})
export class TextControlNumberComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;

  constructor(public validationService: ValidationService) {}
}
