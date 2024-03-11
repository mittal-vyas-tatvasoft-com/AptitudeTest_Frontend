import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../common/interfaces/dialogdata.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public candidateTestService: CandidateTestService
  ) {}
  confirmed(result: boolean) {
    if (result) {
      this.candidateTestService.isEndingTest = true;
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(false);
    }
  }
}
