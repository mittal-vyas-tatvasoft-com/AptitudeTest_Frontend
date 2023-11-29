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
  startEndTimeDifferenceValid = true;
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

  checkDifference() {
    if (
      !this.basicTestDetails.get('startTime')?.hasError('required') &&
      !this.basicTestDetails.get('endTime')?.hasError('required')
    ) {
      const startTime = this.onTimeSet(
        this.basicTestDetails.get('startTime')?.value
      );
      const endTime = this.onTimeSet(
        this.basicTestDetails.get('endTime')?.value
      );

      const difference = Math.floor(
        Math.abs((startTime.getTime() - endTime.getTime()) / (1000 * 60))
      );
      this.basicTestDetails.get('testDuration')?.setValue(difference);
      if (difference != this.basicTestDetails.get('testDuration')?.value) {
        this.startEndTimeDifferenceValid = false;
        this.setEndDate(
          this.basicTestDetails.get('startTime')?.value,
          difference.toString()
        );
      } else {
        this.startEndTimeDifferenceValid = true;
      }
    }
  }

  setEndDate(startTime: string, duration: string) {
    if (startTime != '' && duration != '') {
      var timeComponents = startTime.split(':');
      var hours = parseInt(timeComponents[0], 10);
      var minutes = parseInt(timeComponents[1].split(' ')[0], 10);
      var ampm = timeComponents[1].split(' ')[1];

      if (ampm === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }

      var dateObject = new Date();
      dateObject.setHours(hours);
      dateObject.setMinutes(minutes);
      dateObject.setMinutes(dateObject.getMinutes() + Number(duration));

      var hours = dateObject.getHours();
      var minute = ('0' + dateObject.getMinutes()).slice(-2);
      var ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;

      const formattedString = hours + ':' + minute + ' ' + ampm;
      this.basicTestDetails.get('endTime')?.setValue(formattedString);
      return formattedString;
    } else {
      return null;
    }
  }

  saveBasicDetails() {
    this.saveDetails.emit();
  }
}
