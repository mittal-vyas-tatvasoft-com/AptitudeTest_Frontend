import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from 'src/app/modules/masters/college/components/add-college/add-college.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

export interface CandidateData {
  name: string;
  college: string;
  group: string;
  email: string;
  contact: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent {
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['select', 'name', 'college', 'group', 'email', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CandidateData>;
  selection = new SelectionModel<CandidateData>(true, []);

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Ralph Edwards", college: "Columbia University", group: 'Ahmedabad University', email: 'tanya.hill@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Savannah Nguyen", college: "Harvard University", group: 'Gujarat University', email: 'dolores.chambers@example.com', contact: '755 539 6587', status: "Active", action: "" },
    ]);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: CandidateData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  handleAddCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddCollegeComponent, dialogConfig);
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }
}
