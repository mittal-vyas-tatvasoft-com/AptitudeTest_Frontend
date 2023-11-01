import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminControl } from '../../configs/admin.configs';
import { validations } from 'src/app/shared/messages/validation.static';
import { Numbers } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent implements OnInit, AfterViewInit {
  optionsList = [
    { key: 'Active', value: true },
    { key: 'InActive', value: false },
  ];
  isEditMode: boolean = false;
  form: FormGroup;
  AdminModel = AdminControl;

  constructor(
    public dialogRef: MatDialogRef<AddAdminComponent>,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
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
        next: (res: any) => {
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
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
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
      status: [true, Validators.required],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
