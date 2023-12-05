import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent {
  @Input() basicTestDetails: FormGroup;
  @Input() testBasicDetailFormModel: any;
  @Input() optionsList: SelectOption[];
  @Input() minDate: Date;
  @Input() isEditMode: boolean;
  @Input() getCurrentTime: string;
  startEndTimeDifferenceValid = true;
  currentTime: string;
  @Output() saveDetails = new EventEmitter();
  minStartDate = new Date();
  constructor(public validationService: ValidationService) {}

  onTimeSet(selectedTime: string) {
    const today = new Date();
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':');
    if (period === 'AM' && hours !== '12') {
      today.setHours(Number(hours));
    } else if (period === 'PM' && hours !== '12') {
      today.setHours(Number(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      today.setHours(Number('00'));
    } else {
      today.setHours(Number(hours));
    }
    today.setMinutes(Number(minutes));
    return today;
  }

  saveBasicDetails() {
    this.saveDetails.emit();
  }
}
