import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { validations } from 'src/app/shared/messages/validation.static';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { formControls } from '../../config/profile.config';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss'],
})
export class AddProfileComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  formControl = formControls;
  optionsList = [
    { key: 'Active', value: true },
    { key: 'Inactive', value: false },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddProfileComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private profileService: ProfileService,
    public _formValidators: ValidationService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  ngAfterViewInit(): void {
    if (this.data != 0) {
      this.profileService.GetProfileById(this.data).subscribe({
        next: (res) => {
          this.form.setValue({
            name: res.data.name,
            id: res.data.id,
            status: res.data.status,
          });
        },
      });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      status: [true, [Validators.required]],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
