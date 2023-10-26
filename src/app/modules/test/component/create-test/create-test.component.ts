import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';

export interface CandidateData {
  candidate: string;
  college: string;
  email: string;
  contact: string;
}

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})

export class CreateTestComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '10';
  paginationOptionsList: string[] = ['10', '20', '25'];
  displayedColumns: string[] = ['candidate', 'college', 'email', 'contact'];

  public smallScreen: boolean = (window.innerWidth < 767)
  @ViewChild('stepper') stepper!: MatStepper;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.smallScreen = window.innerWidth < 767;
  }

  dataSource: MatTableDataSource<CandidateData>;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource([
      { candidate: "Theresa Webb", college: "Dartmouth College", email: "theresa.webb@gmail.com", contact: "987 654 3210" },
      { candidate: "Marvin McKinney", college: "Duke University", email: "marvin.mcKinney@gmail.com", contact: "987 654 3210" },
      { candidate: "Bessie Cooper", college: "Rice University", email: "bessie.cooper@gmail.com", contact: "987 654 3210" },
      { candidate: "Theresa Webb", college: "Dartmouth College", email: "theresa.webb@gmail.com", contact: "987 654 3210" },
      { candidate: "Kristin Watson", college: "Princeton University", email: "kristin.watson@gmail.com", contact: "987 654 3210" },
      { candidate: "Theresa Webb", college: "Dartmouth College", email: "theresa.webb@gmail.com", contact: "987 654 3210" },
      { candidate: "Marvin McKinney", college: "Duke University", email: "marvin.mcKinney@gmail.com", contact: "987 654 3210" },
      { candidate: "Bessie Cooper", college: "Rice University", email: "bessie.cooper@gmail.com", contact: "987 654 3210" },
      { candidate: "Theresa Webb", college: "Dartmouth College", email: "theresa.webb@gmail.com", contact: "987 654 3210" },
      { candidate: "Kristin Watson", college: "Princeton University", email: "kristin.watson@gmail.com", contact: "987 654 3210" },
    ]);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.stepper.selectedIndex = 2;
  }

  handleNextClick() {
    this.stepper.next();
  }

}
