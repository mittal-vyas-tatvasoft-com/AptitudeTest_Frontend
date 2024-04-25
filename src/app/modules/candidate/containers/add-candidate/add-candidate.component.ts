import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { Status, StatusCode } from 'src/app/shared/common/enums';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
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
export class AddCandidateComponent implements OnInit, AfterViewInit {
  selectOptionsForGender: SelectOption[] = selectOptionsForGender;
  selectOptionsForStatus: SelectOption[] = selectOptionsForStatus;
  CandidateModel = candidateControl;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  form: FormGroup;
  userId: number;
  defaultGroupId: number;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private loginService: LoginService,
    public _formValidators: ValidationService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getDropdowns();
    this.createForm();
    this.getUserData();
  }

  ngAfterViewInit() {
    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      groups.forEach((group) => {
        if (group.isDefault) {
          this.defaultGroupId = group.id;
          this.form.get('groupId')?.setValue(group.id);
        }
      });
    });
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
          regexValidator(
            new RegExp(validations.common.characterWithSpaceREGEX),
            { characterOnly: true }
          ),
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
          Validators.maxLength(30),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          regexValidator(
            new RegExp(validations.common.characterWithSpaceREGEX),
            { characterOnly: true }
          ),
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
          Validators.maxLength(30),
        ],
      ],
      fatherName: [
        '',
        [
          Validators.required,
          regexValidator(
            new RegExp(validations.common.characterWithSpaceREGEX),
            { characterOnly: true }
          ),
          regexValidator(new RegExp(validations.common.whitespaceREGEX), {
            pattern: true,
          }),
          Validators.maxLength(30),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
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
      gender: [candidateControl.gender.value, [Validators.required]],
      status: [+candidateControl.status.value],
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
      groups.forEach((group) => {
        if (group.isDefault) {
          const defaultGroupName = group.name + ' (Default Group) ';
          this.groups.push({ value: defaultGroupName, id: group.id });
        }
      });
      groups.forEach((element) => {
        if (!element.isDefault) {
          this.groups.push({ value: element.name, id: element.id });
        }
      });
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
      candidateData.status = this.form.value.status === Status.Active;
      candidateData.gender = this.form.value.gender;
      candidateData.createdBy = this.userId;
      this.candidateService
        .addCandidate(candidateData)
        .subscribe((response) => {
          if (response.statusCode == StatusCode.Success) {
            this.isLoading = false;
            this.dialogRef.close({
              refreshTable: true,
              message: response.message,
              status: response.statusCode,
            });
          } else {
            this.snackbarService.error(response.message);
            this.isLoading = false;
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
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
