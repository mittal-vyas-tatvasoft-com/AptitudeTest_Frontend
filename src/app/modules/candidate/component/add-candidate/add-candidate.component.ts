import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CandidateService } from '../../services/candidate.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { validations } from 'src/app/shared/messages/validation.static';
import { DropdownItem, CandidateModel } from '../../interfaces/candidate.interface';
import { CandidateFormControl } from '../../configs/candidate.configs';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent {
  optionsListForStatus: string[] = ['Active', 'Inactive'];
  optionsListForGender: string[] = ['Male', 'Female'];
  fromControls = CandidateFormControl;
  colleges: DropdownItem[] = [];
  groups: DropdownItem[] = []
  form: FormGroup;
  userId: number;
  statusDisplay: string = 'Active';

  constructor(public dialogRef: MatDialogRef<AddCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private loginService: LoginService,
    public _formValidators: ValidationService) { }

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
      groupId: ['', Validators.required],
      collegeId: ['', Validators.required],
      gender: [''],
      status: [this.statusDisplay]
    });
  }

  getDropdowns() {
    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges;
    });

    this.candidateService.getGroupsForDropDown().subscribe((colleges) => {
      this.groups = colleges;
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
      const candidateData: CandidateModel = this.form.value;
      candidateData.status = this.form.value.status === 'Active' ? true : false;
      candidateData.gender = this.form.value.gender === 'Male' ? 1 : 2;
      candidateData.createdBy = this.userId;
      this.candidateService.addCandidate(candidateData).subscribe(
        (response) => {
          this.dialogRef.close({ refreshTable: true });
        },
        (error) => {
        }
      );
    }
    else {
      this.form.markAllAsTouched();
    }
  }
}