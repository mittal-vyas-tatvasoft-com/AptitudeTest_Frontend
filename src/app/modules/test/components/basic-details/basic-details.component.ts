import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StatusCode } from 'src/app/shared/common/enums';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { TestService } from '../../services/test.service';

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
  isTestNameValid = true;
  currentTime: string;
  @Output() saveDetails = new EventEmitter();
  minStartDate = new Date();
  constructor(
    public validationService: ValidationService,
    public testService: TestService
  ) {}

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

  checkTestName() {
    const testName = this.basicTestDetails.get('testName')?.value;
    this.testService.checkTestName(testName).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.AlreadyExist) {
          this.isTestNameValid = false;
        } else if (res.statusCode == StatusCode.Success) {
          this.isTestNameValid = true;
        }
      },
    });
  }
}
