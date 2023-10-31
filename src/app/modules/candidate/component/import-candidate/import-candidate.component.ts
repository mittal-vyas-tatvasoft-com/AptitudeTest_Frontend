import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { AddGroupComponent } from '../add-group/add-group.component';
import { Location } from '@angular/common';



export interface CandidateData {
  candidatesName: string;
  group: string;
  collegeName: string;
  email: string;
  contact: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-import-candidate',
  templateUrl: './import-candidate.component.html',
  styleUrls: ['./import-candidate.component.scss']
})
export class ImportCandidateComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['select', 'candidatesName', 'group', 'collegeName', 'email', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CandidateData>;
  selection = new SelectionModel<CandidateData>(true, []);

  constructor(public dialog: MatDialog, private router: Router, private _location: Location) {
    this.dataSource = new MatTableDataSource([
      { candidatesName: "Theresa Webb", group: 'Ahmedabad University', collegeName: "Dartmouth College", email: 'theresa.webb@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Marvin McKinney", group: 'Gujarat University', collegeName: "Duke University", email: 'marvin.mcKinney@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Bessie Cooper", group: 'Saurashtra University', collegeName: "Rice University", email: 'bessie.cooper@gmail.com', contact: '987 654 3210', status: "Inactive", action: "" },
      { candidatesName: "Kristin Watson", group: 'Changa University', collegeName: "Princeton University", email: 'kristin.watson@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Theresa Webb", group: 'Ahmedabad University', collegeName: "Dartmouth College", email: 'theresa.webb@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Marvin McKinney", group: 'Gujarat University', collegeName: "Duke University", email: 'marvin.mcKinney@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Kristin Watson", group: 'Saurashtra University', collegeName: "Rice University", email: 'bessie.cooper@gmail.com', contact: '987 654 3210', status: "Inactive", action: "" },
      { candidatesName: "Kristin Watson", group: 'Changa University', collegeName: "Rice University", email: 'kristin.watson@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
      { candidatesName: "Kristin Watson", group: 'Ganpat University', collegeName: "Princeton University", email: 'bessie.cooper@gmail.com', contact: '987 654 3210', status: "Active", action: "" },
    ]);
  }

  handleAddGroupDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width = "550px";
    this.dialog.open(AddGroupComponent, dialogConfig);
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.candidatesName + 1}`;
  }

  handleBackBtn() {
    this._location.back();
  }

  // const myGreatDropzone = Dropzone();
}