import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from 'src/app/modules/masters/college/components/add-college/add-college.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { Router } from '@angular/router';

export interface CandidateData {
  name: string;
  college: string;
  yearAdded:string;
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
  displayedColumns: string[] = ['select', 'name', 'college', 'yearAdded', 'group', 'email', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CandidateData>;
  selection = new SelectionModel<CandidateData>(true, []);

  constructor(public dialog: MatDialog,private router: Router) {
    this.dataSource = new MatTableDataSource([
      { name: "Ralph Edwards", college: "Columbia University", yearAdded:"2023", group: 'Ahmedabad University', email: 'tanya.hill@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Savannah Nguyen", college: "Harvard University", yearAdded:"2023", group: 'Gujarat University', email: 'dolores.chambers@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Manufacturing And Packing", college: "Duke University", yearAdded:"2023", group: 'Saurashtra University', email: 'tim.jennings@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Leslie Alexander", college: "Villanova University", yearAdded:"2023", group: 'Changa University', email: 'felicia.reid@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Bessie Cooper", college: "Massachusetts Institute of Technology", yearAdded:"2023", group: 'Ahmedabad University', email: 'curtis.weaver@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Manufacturing And Packing", college: "University of North Carolina, Chapel Hill", yearAdded:"2023", group: 'Gujarat University', email: 'jessica.hanson@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Kathryn Murphy", college: "Standford University", yearAdded:"2023", group: 'Saurashtra University', email: 'debra.holt@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Jenny Wilson", college: "St. John's College", yearAdded:"2023", group: 'Changa University', email: 'sara.cruz@example.com', contact: '755 539 6587', status: "Active", action: "" },
      { name: "Devon Lane", college: "Brigham Young University", yearAdded:"2023", group: 'Ganpat University', email: 'nevaeh.simmons@example.com', contact: '755 539 6587', status: "Inactive", action: "" },
      { name: "Theresa Webb", college: "Brown University", yearAdded:"2023", group: 'Gujarat University', email: 'michael.mitc@example.com', contact: '755 539 6587', status: "Active", action: "" },
    ]);
  }

  handleAddCandidateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width="767px";
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

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

  importCandidates() {
    this.router.navigate(['admin/candidate/import-candidate']);
  }

  handleEditCandidate(){
    this.router.navigate(['admin/candidate/edit']);
  }
}
