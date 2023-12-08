import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import {
  CollegeControl,
  selectOptionsForStatus,
} from '../../configs/college.configs';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-add-college',
  templateUrl: './add-college.component.html',
  styleUrls: ['./add-college.component.scss'],
})
export class AddCollegeComponent implements OnInit, AfterViewInit {
  isEditMode = false;
  form: FormGroup;
  CollegeModel = CollegeControl;
  selectOptionsForStatus: SelectOption[] = selectOptionsForStatus;

  constructor(
    public dialogRef: MatDialogRef<AddCollegeComponent>,
    private collegeService: CollegeService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data != 0) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.createForm();
  }

  ngAfterViewInit(): void {
    if (this.data != 0) {
      this.collegeService.getCollegeById(this.data).subscribe({
        next: (res: any) => {
          this.form.setValue({
            id: res.data.id,
            name: res.data.name,
            abbreviation: res.data.abbreviation,
            status: res.data.status === true ? 1 : 2,
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
          Validators.pattern(validations.common.characterWithSpaceREGEX),
        ],
      ],
      abbreviation: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(2),
          Validators.pattern(validations.common.charactersWithoutSpaces),
        ],
      ],
      status: [1, Validators.required],
    });
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
