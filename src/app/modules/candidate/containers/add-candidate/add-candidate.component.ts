import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { Numbers, Status } from 'src/app/shared/common/enums';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import {
  candidateControl,
  selectOptionsForGender,
  selectOptionsForStatus,
} from '../../configs/candidate.configs';
import { CandidateModel } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss'],
})
export class AddCandidateComponent implements OnInit {
  selectOptionsForGender: SelectOption[] = selectOptionsForGender;
  selectOptionsForStatus: SelectOption[] = selectOptionsForStatus;
  CandidateModel = candidateControl;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  form: FormGroup;
  userId: number;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private loginService: LoginService,
    public _formValidators: ValidationService
  ) {}

  ngOnInit(): void {
    this.getDropdowns();
    this.createForm();
    this.getUserData();
  }

  closeModal() {
    this.dialogRef.close();
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
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
      groupId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gender: [''],
      status: [candidateControl.status.value],
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
  }

  getUserData() {
    const token = this.loginService.getToken();
    if (token) {
      const userData = this.loginService.decodeToken();
      this.userId = userData ? userData.Id : '';
    }
  }

  onSaveClick() {
    if (this.form.valid) {
      this.isLoading = true;
      const candidateData: CandidateModel = this.form.value;
      candidateData.status =
        this.form.value.status === Status.Active ? true : false;
      candidateData.gender =
        this.form.value.gender === 'Male' ? Numbers.One : Numbers.Two;
      candidateData.createdBy = this.userId;
      this.candidateService
        .addCandidate(candidateData)
        .subscribe((response) => {
          this.isLoading = true;
          this.dialogRef.close({
            refreshTable: true,
            message: response.message,
            status: response.statusCode,
          });
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
