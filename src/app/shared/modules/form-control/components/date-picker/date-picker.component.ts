import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  @Input() form!: FormGroup;
  @Input() formControlModel!: FormControlModel;
  @Input() minDate: Date = new Date(new Date().getFullYear() - 50, 0, 1);
  @Input() maxDate: Date = new Date(new Date().getFullYear() + 50, 11, 31);
  @Output() changeDate = new EventEmitter();

  constructor(public validationService: ValidationService) {}

  dateChange() {
    this.changeDate.emit();
  }
}
