import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
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

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getDropdowns();
    if (this.candidateData) {
      this.form.patchValue(this.candidateData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candidateData'] && this.candidateData) {
      this.form.patchValue(this.candidateData);
    }
    console.log(this.candidateData);

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
      firstName: ['', Validators.required],
      lastName: [''],
      fatherName: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.emailREGEX),
        ],
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.mobileNumberREGEX),
        ],
      ],
      userGroup: [''],
      userCollege: ['', Validators.required],
      gender: ['', Validators.required],
      status: [candidateControl.status.value],
      createdYear: [{ value: '', disabled: true }],
      appliedThrough: ['', Validators.required],
      technologyInterestedIn: [''],
      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.pinCodeREGEX),
        ],
      ],
      cityName: [''],
      permanentAddress1: [''],
      state: [''],
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
}
