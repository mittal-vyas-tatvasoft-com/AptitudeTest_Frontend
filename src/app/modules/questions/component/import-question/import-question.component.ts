import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-import-question',
  templateUrl: './import-question.component.html',
  styleUrls: ['./import-question.component.scss']
})
export class ImportQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  public message: string = 'Drag & Drop or <span class="link-primary ml-4p">Browse</span>';

  constructor(private location: Location, public dialog: MatDialog) { }

  handleBackBtn() {
    this.location.back();
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }
}
