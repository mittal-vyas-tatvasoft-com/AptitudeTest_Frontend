import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.scss'],
})
export class TextControlComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;
  @Output() iconClick = new EventEmitter<Event>();

  constructor(public validationService: ValidationService) {}

  onIconClick(event: Event) {
    this.iconClick.emit(event);
  }
}
