import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { UpdateTestTimeCOntrols } from '../../configs/results.config';
import { ApproveTestParams } from '../../interfaces/result.interface';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-update-test-time',
  templateUrl: './update-test-time.component.html',
  styleUrls: ['./update-test-time.component.scss'],
})
export class UpdateTestTimeComponent implements OnInit {
  form!: FormGroup;
  formData = new FormData();

  updateTestTimeControls = UpdateTestTimeCOntrols;
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private resultsService: ResultsService,
    @Inject(MAT_DIALOG_DATA) public data: ApproveTestParams[],
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      timeToBeAdded: [0, [Validators.required]],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  updateTestTime() {
    const time = this.form.get('timeToBeAdded')?.value;
    this.resultsService.updateTestTime(this.data, time).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.statusCode == StatusCode.Success) {
          this.snackbarService.success(res.message);
          this.dialogRef.close();
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (error) => {
        this.snackbarService.error(error.message);
      },
    });
  }
}
