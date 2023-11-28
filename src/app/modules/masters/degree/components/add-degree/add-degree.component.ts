import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControls } from '../../config/degree.config';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { DegreeService } from '../../services/degree.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { Messages } from 'src/app/shared/messages/messages.static';
import { StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { DegreeModel } from '../../interfaces/degree.interface';

export interface Stream {
  name: string;
}

export interface Status {
  key: string;
  value: boolean;
}
export interface Level {
  value: number;
}

@Component({
  selector: 'app-add-degree',
  templateUrl: './add-degree.component.html',
  styleUrls: ['./add-degree.component.scss'],
})
export class AddDegreeComponent implements OnInit, AfterViewInit {
  LevelList: Level[] = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];
  statusList: Status[] = [
    { key: 'Active', value: true },
    { key: 'InActive', value: false },
  ];
  fromControls = FormControls;
  data: DegreeModel;
  form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddDegreeComponent>,
    private fb: FormBuilder,
    public validation: ValidationService,
    private degreeService: DegreeService,
    @Inject(MAT_DIALOG_DATA) public id: number,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0, [Validators.required]],
      name: [
        FormControls.name.value,
        [
          Validators.required,
          Validators.maxLength(FormControls.name.maxLength),
          Validators.minLength(FormControls.name.minLength),
        ],
      ],
      status: [FormControls.status.value, [Validators.required]],
      level: [FormControls.level.value, [Validators.required]],
      streams: [
        '',
        [
          Validators.required,
          Validators.maxLength(FormControls.streams.maxLength),
        ],
      ],
    });
  }

  ngAfterViewInit(): void {
    if (this.id != 0) {
      this.degreeService.get(this.id).subscribe({
        next: (res: ResponseModel<DegreeModel>) => {
          if (res.statusCode == StatusCode.Success) {
            this.data = res.data;
            this.setFormValues();
          }
        },
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  // addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  streams: string[] = [];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      if (value.length > 25) {
        this.snackbarService.error(Messages.streamMaxLengthError);
      } else if (this.streams.includes(value)) {
        this.snackbarService.error(Messages.duplicateError);
      } else {
        this.streams.push(value);
        this.form.get('streams')?.setValue(this.streams);
      }
    }
    // Clear the input value
    event.chipInput.clear();
  }

  remove(fruit: string): void {
    const index = this.streams.indexOf(fruit);

    if (index >= 0) {
      this.streams.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      this.form.get('streams')?.setValue(this.streams);
    }
  }

  edit(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      this.form.get('streams')?.setValue(this.streams);
      return;
    }
    if (value.length > 25) {
      this.snackbarService.error(Messages.streamMaxLengthError);
    } else if (this.streams.includes(value)) {
      this.snackbarService.error(Messages.duplicateError);
    } else {
      // Edit existing fruit
      const index = this.streams.indexOf(fruit);
      if (index >= 0) {
        this.streams[index] = value;
        this.form.get('streams')?.setValue(this.streams);
      }
    }
  }

  setFormValues() {
    this.form.setValue({
      id: this.data.id,
      name: this.data.name,
      status: this.data.status,
      level: this.data.level,
      streams: this.data.streams,
    });
    this.streams = this.data.streams;
  }

  onAddClick() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
