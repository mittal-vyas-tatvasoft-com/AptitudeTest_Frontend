import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddDegreeComponent } from '../add-degree/add-degree.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

export interface DegreeData {
  name: string;
  level: string;
  stream: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent {
  displayedColumns: string[] = ['name', 'level', 'stream', 'status', 'action'];
  dataSource: MatTableDataSource<DegreeData>;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "SSC", level: "1", stream: 'English, hindi, gujarati', status: "Active", action: "" },
      { name: "HSC", level: "2", stream: 'science, commerce ', status: "Active", action: "" },
      { name: "Diploma", level: "3", stream: 'Computer science', status: "Inactive", action: "" },
      { name: "BCA", level: "3", stream: 'Commerce', status: "Active", action: "" },
      { name: "BE", level: "4", stream: 'Computer information', status: "Active", action: "" },
      { name: "MCA", level: "4", stream: 'Master of Computer', status: "Active", action: "" },
    ]);
  }

  handleAddDegreeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddDegreeComponent, dialogConfig);
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

}
