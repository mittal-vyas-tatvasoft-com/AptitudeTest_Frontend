import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormControlModel } from '../../interfaces/form-control-model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent {
  readonly Validators: typeof Validators = Validators;
  selectedTime: any;

  @Output() timeChanged = new EventEmitter<string>();
  @Input() form!: FormGroup;
  @Input() timePickerModel: any;

  @ViewChild('timepicker') timepicker: any;

  constructor(public validationService: ValidationService) {}

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.form.get(this.timePickerModel.key)?.disabled) {
      timepicker.open();
    }
  }

  onClear($event: Event) {
    this.form.get(this.timePickerModel.key)?.setValue(null);
  }

  changeTime() {
    this.timeChanged.emit(this.form.get(this.timePickerModel.key)?.value);
  }

  setNow() {
    const now = new Date();
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const str = hours + ':' + minutes;
    this.form.get(this.timePickerModel.key)?.setValue(str);
  }
}
