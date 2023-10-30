import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddGroupComponent } from '../add-group/add-group.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(public dialog: MatDialog) {}

  handleAddGroupDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width="556px";
    this.dialog.open(AddGroupComponent, dialogConfig);
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }
}
