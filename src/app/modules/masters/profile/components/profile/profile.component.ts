import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

export interface ProfileData {
  name: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource: MatTableDataSource<ProfileData>;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Programming", status: "Active", action: "" },
      { name: "Programming / QA", status: "Active", action: "" },
      { name: "SEO/BA/BD/HR", status: "Active", action: "" },
      { name: ".NET", status: "Active", action: "" },
    ]);
  }

  handleAddProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '556px';
    this.dialog.open(AddProfileComponent, dialogConfig);
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

}
