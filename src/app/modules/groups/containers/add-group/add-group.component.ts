import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { GroupFormControls } from '../../configs/group.config';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddGroupComponent>,
    private fb: FormBuilder,
    public validation: ValidationService,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) {}

  formControls = GroupFormControls;
  data: any;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id, [Validators.required]],
      name: [
        GroupFormControls.name.value,
        [
          Validators.required,
          Validators.maxLength(GroupFormControls.name.maxLength),
        ],
      ],
      isDefault: [GroupFormControls.default.value],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onAddClick() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
