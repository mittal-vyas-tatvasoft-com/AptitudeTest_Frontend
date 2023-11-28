import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
})
export class DeleteConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ) {}

  deleteConfirmed(result: boolean) {
    if (result) {
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(false);
    }
  }
}
// export class DeleteConfirmationDialogComponent implements OnInit {
//   // vars

//   title = '';
//   subHeaderTitle = '';
//   buttonText!: ButtonText;
//   width!: string;
//   dialogWidth!: DialogStyleWidth;

//   constructor(
//     public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
//   ) {}

//   ngOnInit(): void {
//     this.setDialogData(this.data);
//   }

//   setDialogData(data: DialogData) {
//     this.title = data.data.title ?? '';
//     if ('data' in data) {
//       this.subHeaderTitle = data.data.message ?? '';
//       this.buttonText = data.data.buttonText ?? {};
//       this.width = data.data.width ?? '';
//       this.dialogWidth = { width: this.width };
//     }
//   }
// }
