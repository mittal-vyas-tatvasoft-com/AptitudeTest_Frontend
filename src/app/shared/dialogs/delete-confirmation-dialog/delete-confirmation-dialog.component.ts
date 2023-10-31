import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonText, DialogData, DialogStyleWidth } from '../../common/interfaces/dialogdata.interface';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
})
export class DeleteConfirmationDialogComponent {

  constructor(private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) { }

  deleteConfirmed(result: boolean) {
    if (result) {
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(false);
    }
  }
}

