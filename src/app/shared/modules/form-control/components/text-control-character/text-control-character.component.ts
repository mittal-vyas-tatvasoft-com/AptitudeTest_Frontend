import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-text-control-character',
  templateUrl: './text-control-character.component.html',
  styleUrls: ['./text-control-character.component.scss'],
})
export class TextControlCharacterComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;

  constructor(public validationService: ValidationService) {}
}
