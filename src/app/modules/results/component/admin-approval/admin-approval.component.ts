import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { ResultsService } from '../../services/results.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { AdminApproveControls } from '../../configs/results.config';
import {
  ApproveTestData,
  ApproveTestParams,
} from '../../interfaces/result.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { StatusCode } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-admin-approval',
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin-approval.component.scss'],
})
export class AdminApprovalComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  adminApproveControls = AdminApproveControls;
  hint: string = 'Test duration: ';
  approveTestData: ApproveTestData = {
    remainingTimeInMinutes: 0,
    testId: 0,
    userId: 0,
    duration: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    public validation: ValidationService,
    private resultsService: ResultsService,
    @Inject(MAT_DIALOG_DATA) public data: ApproveTestParams,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      remainingTimeInMinutes: [0, [Validators.required]],
    });
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.data.userId != 0 && this.data.testId != 0) {
      this.resultsService
        .getApproveTestDetails(this.data.userId, this.data.testId)
        .subscribe({
          next: (res: ResponseModel<ApproveTestData>) => {
            if (res.statusCode == StatusCode.Success) {
              this.form.setValue({
                remainingTimeInMinutes: Math.floor(
                  res.data.remainingTimeInMinutes / 60
                ),
              });
              this.hint = this.hint + res.data.duration + ' Minutes';
              this.approveTestData = res.data;
            } else {
              this.snackbarService.error(res.message);
              this.dialogRef.close();
            }
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.snackbarService.error(error.message);
          },
        });
    }
    this.cdr.detectChanges();
  }

  closeModal() {
    this.dialogRef.close();
  }

  submit() {
    const remainingTime = this.form.get('remainingTimeInMinutes')?.value;
    if (remainingTime > Number(this.approveTestData?.duration)) {
      this.snackbarService.error(
        this.adminApproveControls.remainingTimeInMinutes.maxLimitErrMsg +
          this.approveTestData.duration
      );
      return;
    }
    const data: ApproveTestData = {
      remainingTimeInMinutes: remainingTime,
      testId: this.data.testId,
      userId: this.data.userId,
    };

    this.resultsService.approveResumeTest(data).subscribe({
      next: (res) => {
        if (res.statusCode === StatusCode.Success) {
          this.snackbarService.success(res.message);
          this.closeModal();
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
