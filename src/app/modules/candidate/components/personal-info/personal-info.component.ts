import { Component, Input, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validations } from 'src/app/shared/messages/validation.static';
import { candidateControl, selectOptionsForAppliedThrough, selectOptionsForGender, selectOptionsForStatus } from '../../configs/candidate.configs';
import { CandidateService } from '../../services/candidate.service';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import * as moment from 'moment';
import { UserData } from '../../interfaces/candidate.interface';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectOptionsForGender: SelectOption[] = selectOptionsForGender;
  selectOptionsForStatus: SelectOption[] = selectOptionsForStatus;
  selectOptionsForAppliedThrough: SelectOption[] = selectOptionsForAppliedThrough;
  selectOptionsForYear: SelectOption[] = [];
  CandidateModel = candidateControl;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  profiles: SelectOption[] = [];
  states: SelectOption[] = [];
  form: FormGroup;
  @Input() candidateData: UserData;

  constructor(private formBuilder: FormBuilder, private candidateService: CandidateService,) { }

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
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      fatherName: [''],
      email: ['', [
        Validators.required,
        Validators.pattern(validations.common.emailREGEX),
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(validations.common.mobileNumberREGEX),
      ]],
      userGroup: ['', Validators.required],
      userCollege: ['', Validators.required],
      gender: [''],
      status: [candidateControl.status.value],
      year: [''],
      appliedThrough: [''],
      technologyInterestedIn: [''],
      pincode: [''],
      cityName: [''],
      permanentAddress1: [''],
      state: [''],
      dateOfBirth: ['']
    });
  }

  getDropdowns() {
    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges.map((college) => ({
        id: college.id,
        key: college.name,
        value: college.name,
      }));
    });

    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      this.groups = groups.map((groups) => ({
        id: groups.id,
        key: groups.name,
        value: groups.name,
      }));
    });

    this.candidateService.getProfilesForDropDown().subscribe((profiles) => {
      this.profiles = profiles.map((profiles) => ({
        id: profiles.id,
        key: profiles.name,
        value: profiles.name,
      }));
    });

    this.candidateService.getStateForDropDown().subscribe((states) => {
      this.states = states.map((states) => ({
        id: states.id,
        key: states.name,
        value: states.name,
      }));
    });

    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.selectOptionsForYear.push({ id: year, key: year.toString(), value: year.toString() });
    }

  }

  validateForm() {
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.get(controlName)?.markAsTouched();
    });
  }

  getFormData(): FormGroup {
    const dateOfBirthControl = this.form.get('dateOfBirth');
    if (dateOfBirthControl!.value) {
      const formattedDateOfBirth = moment(dateOfBirthControl!.value).format('YYYY-MM-DD');
      dateOfBirthControl!.setValue(formattedDateOfBirth);
    }
    if (dateOfBirthControl!.value == '0001-01-01') {
      dateOfBirthControl!.setValue(null);
    }
    return this.form;
  }
}