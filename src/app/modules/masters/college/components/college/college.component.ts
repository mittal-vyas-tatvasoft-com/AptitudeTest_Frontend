import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from '../add-college/add-college.component';

export interface UserData {
  name: string;
  abbreviation: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})
export class CollegeComponent {
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['name', 'abbreviation', 'status', 'action'];
  dataSource: MatTableDataSource<UserData>;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Columbia University", abbreviation: "GTU", status: "Active", action: "" },
      { name: "Harvard University", abbreviation: "GTU", status: "Active", action: "" },
      { name: "Duke University", abbreviation: "DDU", status: "Inactive", action: "" },
      { name: "Villanova University", abbreviation: "DDU", status: "Active", action: "" },
      { name: "Massachusetts Institute of Technology", abbreviation: "VGEC", status: "Active", action: "" },
      { name: "University of North Carolina, Chapel Hill", abbreviation: "VGEC", status: "Active", action: "" },
      { name: "Standford University", abbreviation: "SVIT", status: "Inactive", action: "" },
      { name: "St. John's College", abbreviation: "SVIT", status: "Active", action: "" },
      { name: "Brigham Young University", abbreviation: "Nirma University", status: "Inactive", action: "" },
      { name: "Brown University", abbreviation: "Nirma University", status: "Active", action: "" },
    ]);
  }

  handleAddCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddCollegeComponent, dialogConfig);
  }

  handleEditCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddCollegeComponent, dialogConfig);
  }
}
