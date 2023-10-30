import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Router } from '@angular/router';

export interface TestData {
  test: string;
  group: string;
  testTime: string;
  startTime: string;
  endTime: string;
  NoOfCandidates: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['test', 'group', 'testTime', 'startTime', 'endTime', 'NoOfCandidates', 'status', 'action'];
  dataSource: MatTableDataSource<TestData>;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(public dialog: MatDialog, private router: Router) {
    this.dataSource = new MatTableDataSource([
      { test: "Maths Test", group: "Columbia University", testTime: "60m", startTime: "17 Jun, 2020 02:57 pm", endTime: "17 Jun, 2020 02:57 pm", NoOfCandidates: "470", status: "Active", action: "" },
      { test: "Grammer Test", group: "Harvard University", testTime: "60m", startTime: "23 Jun, 2020 01:17 pm", endTime: "23 Jun, 2020 01:17 pm", NoOfCandidates: "854", status: "Completed", action: "" },
      { test: "Practical Test", group: "Duke University", testTime: "60m", startTime: "26 Jun, 2020 12:30 am", endTime: "26 Jun, 2020 12:30 am", NoOfCandidates: "478", status: "Draft", action: "" },
      { test: "Reasoning Test", group: "Villanova University", testTime: "60m", startTime: "29 Jun, 2020 07:40 am", endTime: "29 Jun, 2020 07:40 am", NoOfCandidates: "605", status: "Completed", action: "" },
      { test: "English Test", group: "Massachusetts Institute of Technology", testTime: "60m", startTime: "04 Jun, 2020 04:51 am", endTime: "04 Jun, 2020 04:51 am", NoOfCandidates: "800", status: "Completed", action: "" },
      { test: "Aptitude Test", group: "University of North Carolina, Chapel Hill", testTime: "60m", startTime: "24 Jun, 2020 09:20 am", endTime: "24 Jun, 2020 09:20 am", NoOfCandidates: "758", status: "Draft", action: "" },
      { test: "Technical Test", group: "Standford University", testTime: "60m", startTime: "01 Jun, 2020 05:05 pm", endTime: "01 Jun, 2020 05:05 pm", NoOfCandidates: "900", status: "Completed", action: "" },
      { test: "Programming Test", group: "St. John's College", testTime: "60m", startTime: "17 Jun, 2020 06:49 am", endTime: "17 Jun, 2020 06:49 am", NoOfCandidates: "244", status: "Draft", action: "" },
      { test: "Maths Test", group: "Brigham Young University", testTime: "60m", startTime: "04 Jun, 2020 07:00 am", endTime: "04 Jun, 2020 07:00 am", NoOfCandidates: "488", status: "Completed", action: "" },
    ]);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

  handleTestDetailRow() {
    this.router.navigate(['/admin/test/create-test'])
  }
}
