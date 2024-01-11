import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validations } from 'src/app/shared/messages/validation.static';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { GroupFormControls } from '../../configs/group.config';
import { GroupsModel } from '../../interfaces/groups.interface';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {
  id: number = 0;
  isEditMode: boolean = false;
  formControls = GroupFormControls;
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddGroupComponent>,
    private fb: FormBuilder,
    public validation: ValidationService,
    @Inject(MAT_DIALOG_DATA) public data: GroupsModel
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id, [Validators.required]],
      name: [
        GroupFormControls.name.value,
        [
          Validators.required,
          Validators.maxLength(GroupFormControls.name.maxLength),
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      isDefault: [
        {
          value: GroupFormControls.default.value,
          disabled: this.data.isDefault,
        },
      ],
    });

    if (this.data.id != 0) {
      this.isEditMode = !this.isEditMode;
      this.form.setValue({
        id: this.data.id,
        name: this.data.name,
        isDefault: this.data.isDefault,
      });
    } else {
      this.form.setValue({
        id: this.data.id,
        name: this.data.name,
        isDefault: this.data.isDefault,
      });
    }
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
