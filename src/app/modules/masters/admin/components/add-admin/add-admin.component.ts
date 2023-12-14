import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';
import { validations } from 'src/app/shared/messages/validation.static';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { AdminControl } from '../../configs/admin.configs';
import { AdminModel } from '../../interfaces/admin.interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent implements OnInit, AfterViewInit {
  optionsList = [
    { key: 'Active', value: true },
    { key: 'Inactive', value: false },
  ];
  isEditMode = false;
  form: FormGroup;
  AdminModel = AdminControl;

  constructor(
    public dialogRef: MatDialogRef<AddAdminComponent>,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit(): void {
    if (this.data != Numbers.Zero) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.createForm();
  }

  ngAfterViewInit(): void {
    if (this.data != Numbers.Zero) {
      this.adminService.getAdminById(this.data).subscribe({
        next: (res) => {
          this.form.setValue({
            firstName: res.data.firstName,
            middleName: res.data.fatherName,
            lastName: res.data.lastName,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber,
            id: res.data.id,
            status: res.data.status,
          });
        },
      });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [Numbers.Zero],
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      middleName: [
        '',
        [Validators.pattern(validations.common.whitespaceREGEX)],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(AdminControl.email.maxLength),
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
      status: [true, Validators.required],
    });
  }

  submit() {
    const payload: AdminModel = {
      id: this.form.get('id')?.value,
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      middleName: this.form.get('middleName')?.value,
      lastName: this.form.get('lastName')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      status: this.form.get('status')?.value,
    };

    if (this.form.get('id')?.value === 0) {
      this.adminService.addNewAdmin(payload).subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.dialogRef.close(true);
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
    } else {
      this.adminService.updateAdmin(payload).subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.dialogRef.close(true);
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
