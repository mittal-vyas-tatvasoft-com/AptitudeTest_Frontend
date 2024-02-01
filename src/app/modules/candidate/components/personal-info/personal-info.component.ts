import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { StatusCode } from 'src/app/shared/common/enums';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  candidateControl,
  selectOptionsForAppliedThrough,
  selectOptionsForGender,
  selectOptionsForStatus,
} from '../../configs/candidate.configs';
import { UserData } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnChanges {
  selectOptionsForGender: SelectOption[] = selectOptionsForGender;
  selectOptionsForStatus: SelectOption[] = selectOptionsForStatus;
  selectOptionsForAppliedThrough: SelectOption[] =
    selectOptionsForAppliedThrough;
  selectOptionsForYear: SelectOption[] = [];
  CandidateModel = candidateControl;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  profiles: SelectOption[] = [];
  states: SelectOption[] = [];
  form: FormGroup;
  maxDate = new Date();
  @Input() candidateData: UserData;
  @Input() isAdmin: boolean;
  @Input() candidateEditMode: boolean;
  @Input() collegeSelectedByCandidate: boolean;
  isCollegeSelectedByCandidate = false;

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getDropdowns();
    this.form.get('userCollege')?.valueChanges.subscribe(() => {
      if (this.collegeSelectedByCandidate) {
        this.form.get('userCollege')?.disable();
      }
    });
    if (this.candidateData) {
      this.form.patchValue(this.candidateData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candidateData'] && this.candidateData) {
      this.form.patchValue(this.candidateData);
    }
    if (this.candidateData?.pincode == 0) {
      this.form.get('pincode')?.patchValue('');
    }
    if (this.candidateData?.appliedThrough == 0) {
      this.form.get('appliedThrough')?.patchValue('');
    }
    if (this.candidateData?.dateOfBirth == '0001-01-01T00:00:00') {
      this.form.get('dateOfBirth')?.patchValue('');
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: [
        {
          value: '',
          disabled: this.isAdmin || this.candidateEditMode,
        },
        [
          Validators.required,
          Validators.maxLength(30),
          regexValidator(
            new RegExp(validations.common.characterWithSpaceREGEX),
            { characterOnly: true }
          ),
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
        ],
      ],
      lastName: [
        { value: '', disabled: this.candidateEditMode },
        [
          Validators.required,
          Validators.maxLength(30),
          regexValidator(
            new RegExp(validations.common.characterWithSpaceREGEX),
            { characterOnly: true }
          ),
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
        ],
      ],
      fatherName: [
        '',
        [
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
          Validators.maxLength(30),
        ],
      ],
      email: [
        { value: '', disabled: this.isAdmin || this.candidateEditMode },
        [
          Validators.required,
          Validators.pattern(validations.common.emailREGEX),
          Validators.maxLength(40),
        ],
      ],
      phoneNumber: [
        { value: '', disabled: this.isAdmin || this.candidateEditMode },
        [
          Validators.required,
          Validators.pattern(validations.common.mobileNumberREGEX),
        ],
      ],
      userGroup: [''],
      userCollege: ['', Validators.required],
      gender: ['', [Validators.required]],
      status: [candidateControl.status.value],
      createdYear: [{ value: '', disabled: this.isAdmin }],
      password: ['', [Validators.pattern(validations.common.passwordREGEX)]],
      appliedThrough: ['', Validators.required],
      technologyInterestedIn: ['', [Validators.required]],
      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.pinCodeREGEX),
        ],
      ],
      cityName: ['', [Validators.required]],
      permanentAddress1: [
        '',
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      state: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
    });
  }

  getDropdowns() {
    this.candidateService
      .getCollegesForDropDown(this.isAdmin)
      .subscribe((colleges) => {
        this.colleges = colleges.map((college) => ({
          id: college.id,
          key: college.name,
          value: college.name,
        }));
      });

    if (this.isAdmin) {
      this.candidateService.getGroupsForDropDown().subscribe((groups) => {
        this.groups = groups.map((groups) => ({
          id: groups.id,
          key: groups.name,
          value: groups.name,
        }));
        this.updateValidators();
      });
    }

    this.candidateService
      .getProfilesForDropDown(this.isAdmin)
      .subscribe((profiles) => {
        this.profiles = profiles.map((profiles) => ({
          id: profiles.id,
          key: profiles.name,
          value: profiles.name,
        }));
      });

    this.candidateService
      .getStateForDropDown(this.isAdmin)
      .subscribe((states) => {
        this.states = states.map((states) => ({
          id: states.id,
          key: states.name,
          value: states.name,
        }));
      });

    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.selectOptionsForYear.push({
        id: year,
        key: year.toString(),
        value: year.toString(),
      });
    }
  }

  onIconClick(event: any) {
    if (event.inputType === 'text') {
      event.inputType = 'password';
      this.CandidateModel.password.iconName =
        'password-visibility-show-dark.svg';
    } else {
      event.inputType = 'text';
      this.CandidateModel.password.iconName =
        'password-visibility-hide-dark.svg';
    }
  }

  updateValidators() {
    if (!this.isAdmin) {
      this.form.get('userGroup')?.clearValidators();
      this.form.get('userGroup')?.updateValueAndValidity();
    } else {
      this.form.get('userGroup')?.setValidators(Validators.required);
      this.form.get('userGroup')?.updateValueAndValidity();
    }
  }

  validateForm() {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  getFormData(): FormGroup {
    const dateOfBirthControl = this.form.get('dateOfBirth');
    if (dateOfBirthControl?.value) {
      const formattedDateOfBirth = moment(dateOfBirthControl?.value).format(
        'YYYY-MM-DD'
      );
      dateOfBirthControl?.setValue(formattedDateOfBirth);
    }
    if (dateOfBirthControl?.value == '0001-01-01') {
      dateOfBirthControl?.setValue(null);
    }
    const userCollegeControl = this.form.get('userCollege');
    if (userCollegeControl && userCollegeControl.value === '0') {
      userCollegeControl.setErrors({ required: true });
      userCollegeControl.setErrors({ custom: 'User College is required' });
      userCollegeControl.markAsTouched();
    }
    return this.form;
  }

  changePassword() {
    const Email = this.form.get('email')?.value;
    const Password = this.form.get('password')?.value;
    this.candidateService.ChangeUserPasswordByAdmin(Email, Password).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }
}

export function regexValidator(
  regex: RegExp,
  error: ValidationErrors
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // Check if the control value is falsy (undefined, null, empty string, etc.)
    if (!control.value) {
      return null; // Return null if the value is falsy
    }

    // Test the control value against the regular expression
    const valid = regex.test(control.value);

    // Return the error object if the validation fails, otherwise, return null
    return valid ? null : error;
  };
}
