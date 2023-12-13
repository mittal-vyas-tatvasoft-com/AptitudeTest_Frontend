import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DropdownItem } from 'src/app/modules/candidate/interfaces/candidate.interface';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import { FilterControls } from '../../configs/results.config';
import { ResultsService } from '../../services/results.service';
import { Sort } from '@angular/material/sort';
import { Numbers } from 'src/app/shared/common/enums';
import { ResultData, StatisticsData } from '../../interfaces/result.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  colleges: DropdownItem[] = [];
  groups: DropdownItem[] = [];
  tests: DropdownItem[] = [];
  filterForm: FormGroup;
  dataSource: MatTableDataSource<ResultData>;
  statisticsData: MatTableDataSource<StatisticsData>;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private resultService: ResultsService,
    private router: Router
  ) {
    this.statisticsData = new MatTableDataSource([
      {
        name: 'Average',
        points: '1.000 (5%)',
        pointsColor: 'red',
        correct: '15.00 (15%)',
        wrong: '30.00 (25%)',
        unanswered: '30.00 (25%)',
        undisplayed: '30.00 (25%)',
      },
      {
        name: 'Minimum',
        points: '15.00 (15%)',
        pointsColor: 'green',
        correct: '30.00 (25%)',
        wrong: '25.00 (18%)',
        unanswered: '1.000 (5%)',
        undisplayed: '1.000 (5%)',
      },
      {
        name: 'Maximum',
        points: '25.00 (18%)',
        pointsColor: 'green',
        correct: '1.000 (5%)',
        wrong: '5.000 (10%)',
        unanswered: '25.00 (18%)',
        undisplayed: '15.00 (15%)',
      },
    ]);
    this.dataSource = new MatTableDataSource([
      {
        name: 'Ralph Edwards',
        universityName: 'Columbia University',
        startTime: '17 Jun, 2020 02:57 pm',
        points: '30.00 (25%)',
        pointsColor: 'green',
        correct: '5.000 (10%)',
        wrong: '1.000 (5%)',
        unanswered: '1.000 (5%)',
        undisplayed: '1.000 (5%)',
        status: 'Active',
        action: '',
      },
      {
        name: 'Savannah Nguyen',
        universityName: 'Columbia University',
        startTime: '23 Jun, 2020 01:17 pm',
        points: '1.000 (5%)',
        pointsColor: 'red',
        correct: '15.00 (15%)',
        wrong: '30.00 (25%)',
        unanswered: '30.00 (25%)',
        undisplayed: '30.00 (25%)',
        status: 'Pending',
        action: '',
      },
      {
        name: 'Arlene McCoy',
        universityName: 'Columbia University',
        startTime: '26 Jun, 2020 12:30 am',
        points: '15.00 (15%)',
        pointsColor: 'green',
        correct: '30.00 (25%)',
        wrong: '25.00 (18%)',
        unanswered: '25.00 (18%)',
        undisplayed: '25.00 (18%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Wade Warren',
        universityName: 'Brown University',
        startTime: '29 Jun, 2020 07:40 am',
        points: '25.00 (18%)',
        pointsColor: 'green',
        correct: '1.000 (5%)',
        wrong: '5.000 (10%)',
        unanswered: '5.000 (10%)',
        undisplayed: '5.000 (10%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Courtney Henry',
        universityName: 'Brigham Young University',
        startTime: '04 Jun, 2020 04:51 am',
        points: '5.000 (10%)',
        pointsColor: 'red',
        correct: '25.00 (18%)',
        wrong: '15.00 (15%)',
        unanswered: '15.00 (15%)',
        undisplayed: '15.00 (15%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Robert Fox',
        universityName: "St. John's College",
        startTime: '24 Jun, 2020 09:20 am',
        points: '30.00 (25%)',
        pointsColor: 'green',
        correct: '15.00 (15%)',
        wrong: '1.000 (5%)',
        unanswered: '1.000 (5%)',
        undisplayed: '1.000 (5%)',
        status: 'Pending',
        action: '',
      },
      {
        name: 'Bessie Cooper',
        universityName: 'Standford University',
        startTime: '01 Jun, 2020 05:05 pm',
        points: '1.000 (5%)',
        pointsColor: 'red',
        correct: '30.00 (25%)',
        wrong: '30.00 (25%)',
        unanswered: '30.00 (25%)',
        undisplayed: '30.00 (25%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Darrell Steward',
        universityName: 'Villanova University',
        startTime: '17 Jun, 2020 06:49 am',
        points: '15.00 (15%)',
        pointsColor: 'green',
        correct: '1.000 (5%)',
        wrong: '15.00 (15%)',
        unanswered: '15.00 (15%)',
        undisplayed: '15.00 (15%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Albert Flores',
        universityName: 'Duke University',
        startTime: '04 Jun, 2020 07:00 am',
        points: '25.00 (18%)',
        pointsColor: 'green',
        correct: '25.00 (18%)',
        wrong: '25.00 (18%)',
        unanswered: '25.00 (18%)',
        undisplayed: '25.00 (18%)',
        status: 'Locked',
        action: '',
      },
      {
        name: 'Jacob Jones',
        universityName: 'Harvard University',
        startTime: '08 Jun, 2020 06:00 am',
        points: '5.000 (10%)',
        pointsColor: 'red',
        correct: '5.000 (10%)',
        wrong: '5.000 (10%)',
        unanswered: '5.000 (10%)',
        undisplayed: '5.000 (10%)',
        status: 'Locked',
        action: '',
      },
    ]);
  }

  sortKey: string;
  sortDirection: string;
  filterControls = FilterControls;

  ngOnInit(): void {
    this.createForm();
    this.getDropdowns();
    this.filterForm.valueChanges.subscribe();
  }

  clearFilters() {
    this.filterForm.setValue({
      searchQuery: '',
      test: '',
      group: '',
      college: '',
    });
  }

  createForm() {
    this.filterForm = this.fb.group({
      searchQuery: [],
      test: [],
      group: [],
      college: [],
    });
  }

  getDropdowns() {
    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges;
    });

    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      this.groups = groups;
    });

    this.resultService.getTestsForDropDown().subscribe((tests) => {
      this.tests = tests;
    });
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageIndex = Numbers.Zero;
    this.fetchResults();
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchResults();
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.fetchResults();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'name':
        this.sortKey = 'FirstName';
        this.sortDirection = event.direction;
        break;

      case 'collegeName':
        this.sortKey = 'CollegeName';
        this.sortDirection = event.direction;
        break;

      case 'groupName':
        this.sortKey = 'GroupName';
        this.sortDirection = event.direction;
        break;

      case 'email':
        this.sortKey = 'Email';
        this.sortDirection = event.direction;
        break;

      case 'phoneNumber':
        this.sortKey = 'PhoneNumber';
        this.sortDirection = event.direction;
        break;

      case 'createdYear':
        this.sortKey = 'CreatedYear';
        this.sortDirection = event.direction;
        break;

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.fetchResults();
  }

  fetchResults() {
    // const searchQuery = this.filterForm.get('searchQuery')?.value;
    // const testId = this.filterForm.get('test')?.value;
    // const collegeId = this.filterForm.get('group')?.value;
    // const groupId = this.filterForm.get('college')?.value;
    // const params: GetResultsParams = {
    //   currentPageIndex: this.currentPageIndex,
    //   pageSize: this.pageSize,
    //   searchQuery: searchQuery,
    //   collegeId: collegeId,
    //   groupId: groupId,
    //   sortField: this.sortKey,
    //   sortOrder: this.sortDirection,
    // };
    // this.resultService.getResults(params).subscribe((data: any) => {
    //   data.forEach(
    //     (candidate: { name: string; firstName: string; lastName: string }) => {
    //       candidate.name = `${candidate.firstName} ${candidate.lastName || ''}`;
    //     }
    //   );
    //   this.dataSource = new MatTableDataSource<ResultData>(data);
    //   if (data && data.length > 0) {
    //     this.totalItemsCount = data[0].totalRecords;
    //   }
    // });
  }

  exportData() {
    //this.resultService.downloadExcel();
  }

  getDetails(id: number) {
    let testId = 0;
    this.router.navigate([`admin/results/result-details/${id}/${testId}`]);
  }
}
