import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from 'src/app/modules/masters/college/components/add-college/add-college.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';

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
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['select', 'name', 'college', 'group', 'email', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CandidateData>;
  selection = new SelectionModel<CandidateData>(true, []);

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Ralph Edwards", college: "Columbia University", group: 'Ahmedabad University', email: 'tanya.hill@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Savannah Nguyen", college: "Harvard University", group: 'Gujarat University', email: 'dolores.chambers@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Manufacturing And Packing", college: "Duke University", group: 'Saurashtra University', email: 'tim.jennings@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Leslie Alexander", college: "Villanova University", group: 'Changa University', email: 'felicia.reid@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Bessie Cooper", college: "Massachusetts Institute of Technology", group: 'Ahmedabad University', email: 'curtis.weaver@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Manufacturing And Packing", college: "University of North Carolina, Chapel Hill", group: 'Gujarat University', email: 'jessica.hanson@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Kathryn Murphy", college: "Standford University", group: 'Saurashtra University', email: 'debra.holt@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Jenny Wilson", college: "St. John's College", group: 'Changa University', email: 'sara.cruz@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Devon Lane", college: "Brigham Young University", group: 'Ganpat University', email: 'nevaeh.simmons@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Theresa Webb", college: "Brown University", group: 'Gujarat University', email: 'michael.mitc@example.com', contact: '755 539 6587', status: "Active", action: "" },
    ]);
  }

  handleAddCandidateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width="800px";
    this.dialog.open(AddCandidateComponent, dialogConfig);
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
