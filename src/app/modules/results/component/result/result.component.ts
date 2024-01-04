import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import { SettingService } from 'src/app/modules/setting/services/setting.service';
import { Numbers, StatusCode, TestStatus } from 'src/app/shared/common/enums';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { FilterControls } from '../../configs/results.config';
import {
  ApproveTestParams,
  ResultModel,
  ResultQueryParam,
  StatisticsData,
} from '../../interfaces/result.interface';
import { ResultsService } from '../../services/results.service';
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';
import { UpdateTestTimeComponent } from '../update-test-time/update-test-time.component';

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
  colleges: SelectOption[] = [{ id: 0, value: 'All' }];
  groups: SelectOption[] = [{ id: 0, value: 'All' }];
  tests: SelectOption[] = [{ id: 0, value: 'All' }];
  filterForm: FormGroup;
  dataSource: MatTableDataSource<ResultModel>;
  statisticsData: MatTableDataSource<StatisticsData>;
  sortKey: string;
  sortDirection: string;
  cutOff: number;
  isAllRowsSelected: boolean;
  filterControls = FilterControls;
  params: ResultQueryParam;
  private searchInputValue = new Subject<string>();
  userAndTestIds: ApproveTestParams[] = [];
  results: ResultModel[] = [];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private resultService: ResultsService,
    private router: Router,
    private snackbarService: SnackbarService,
    private settingService: SettingService
  ) {
    this.statisticsData = new MatTableDataSource<StatisticsData>();
    this.dataSource = new MatTableDataSource<ResultModel>();
  }

  ngOnInit(): void {
    this.settingService.get().subscribe({
      next: (res) => {
        this.cutOff = res.data.cutOff;
      },
    });
    this.createForm();
    this.getDropdowns();
    this.initializeParam();
    this.fetchResults();
    this.getStatistics();
    this.searchInputValue
      .pipe(
        debounceTime(Numbers.Debounce) // Adjust the debounce time as needed
      )
      .subscribe(() => {
        this.fetchResults();
        this.getStatistics();
      });

    this.filterForm.get('test')?.valueChanges.subscribe((res) => {
      if (res != 0) {
        this.resultService.GetGroupOfTest(res).subscribe((data) => {
          this.filterForm.get('group')?.setValue(data.data);
          this.fetchResults();
          this.getStatistics();
        });
      }
    });
  }

  clearFilters() {
    this.filterForm.setValue({
      searchQuery: '',
      test: '',
      group: '',
      college: '',
    });
    this.initializeParam();
    this.fetchResults();
    this.getStatistics();
  }

  onFilterChange() {
    this.fetchResults();
    this.getStatistics();
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
      const temp = colleges.map((res) => {
        return { id: res.id, value: res.name };
      });
      this.colleges = [...this.colleges, ...temp];
    });

    this.candidateService.getGroupsForDropDown().subscribe((groupElements) => {
      groupElements.forEach((groupElement) => {
        if (groupElement.isDefault) {
          const defaultGroupName = groupElement.name + ' (Default Group) ';
          this.groups.push({ value: defaultGroupName, id: groupElement.id });
        }
      });
      groupElements.forEach((groupElement) => {
        if (!groupElement.isDefault) {
          this.groups.push({
            value: groupElement.name,
            id: groupElement.id,
          });
        }
      });
    });

    this.resultService.getTestsForDropDown().subscribe((tests) => {
      const temp = tests.map((res) => {
        return { id: res.id, value: res.name };
      });
      this.tests = [...this.tests, ...temp];
    });
  }

  exportData() {
    this.resultService
      .getExportData(this.params, this.currentPageIndex, this.pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            if (res.data.length > 0) {
              let data = this.resultService.mapExportData(res.data);
              this.resultService.downloadExcel(data);
              this.snackbarService.success(res.message);
            }
          } else {
            this.snackbarService.error(res.message);
          }
        },
        error: (error) => {
          this.snackbarService.error(error.message);
        },
      });
  }

  getDetails(data: { id: number; testId: number }) {
    this.router.navigate([
      `admin/results/result-details/${data.id}/${data.testId}`,
    ]);
  }

  handleAllRowsSelected(areAllRowsSelected: boolean) {
    this.isAllRowsSelected = areAllRowsSelected;
    if (this.isAllRowsSelected) {
      this.resultService
        .getResults(this.params, this.currentPageIndex, this.pageSize)
        .subscribe((res) => {
          res.data.forEach((result) => {
            if (result.status === 'Active') {
              const userExists = this.userAndTestIds.some(
                (user) =>
                  user.userId == result.userId &&
                  user.testId == result.userTestId
              );
              if (!userExists) {
                this.userAndTestIds.push({
                  userId: result.userId,
                  testId: result.userTestId,
                });
              }
            }
          });
        });
    } else {
      this.userAndTestIds = [];
    }
    console.log(this.userAndTestIds);
  }

  handleCheckBoxData(data: { userId: number; testId: number }) {
    const userExists = this.userAndTestIds.some(
      (user) => user.userId == data.userId && user.testId == data.testId
    );
    if (!userExists) {
      this.userAndTestIds.push({ userId: data.userId, testId: data.testId });
    } else {
      const index = this.userAndTestIds.findIndex(
        (user) => user.userId == data.userId && user.testId == data.testId
      );
      if (index > -1) {
        this.userAndTestIds.splice(index, 1);
      }
    }
  }

  updateTestTime() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = this.userAndTestIds;
    console.log(dialogConfig);
    this.dialog
      .open(UpdateTestTimeComponent, dialogConfig)
      .afterClosed()
      .subscribe();
  }

  getStatistics() {
    this.createParam();
    this.resultService.getStatistics(this.params).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          let data = res.data.map((record) => {
            return {
              name: record.statisticsHeader,
              points: record.points.toString(),
              pointsColor: record.points <= this.cutOff ? 'red' : 'green',
              correct: record.correct,
              wrong: record.wrong,
              unanswered: record.unAnswered.toString(),
              undisplayed: record.unDisplayed.toString(),
            };
          });
          this.statisticsData = new MatTableDataSource<StatisticsData>(data);
        } else {
          this.statisticsData = new MatTableDataSource<StatisticsData>([]);
        }
      },
      error: (error) => {
        this.snackbarService.error(error.message);
      },
    });
  }

  fetchResults() {
    this.createParam();
    this.resultService
      .getResults(this.params, this.currentPageIndex, this.pageSize)
      .subscribe((res) => {
        if (res.statusCode == StatusCode.Success) {
          if (res.data && res.data.length > 0) {
            let data: ResultModel[] = res.data.map((record) => {
              return {
                id: record.userId,
                testId: record.userTestId,
                name: record.firstName + ' ' + record.lastName,
                points: record.points.toString(),
                correct: record.correctMarks + ' (' + record.correctCount + ')',
                pointsColor: record.points <= this.cutOff ? 'red' : 'green',
                status: record.status,
                unanswered: record.unAnsweredCount.toString(),
                undisplayed: record.unDisplayedCount.toString(),
                universityName: record.collegeName,
                wrong: record.wrongMarks + ' (' + record.wrongCount + ')',
                startTime: this.getTrimmedTime(record.startTime),
                action: '',
              };
            });
            this.totalItemsCount = res.data[0].totalRecords;
            this.dataSource = new MatTableDataSource<ResultModel>(data);
          } else {
            this.totalItemsCount = 0;
            this.dataSource = new MatTableDataSource<ResultModel>([]);
          }
        } else {
          this.snackbarService.error(res.message);
        }
      });
  }

  getTrimmedTime(date: string) {
    let tempDate = new Date(date);
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth() + 1;
    const day = tempDate.getDate();
    const hours = tempDate.getHours();
    const minutes = tempDate.getMinutes();
    const seconds = tempDate.getSeconds();
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  createParam() {
    const searchQuery: string = this.filterForm.get('searchQuery')?.value;
    const testId = this.filterForm.get('test')?.value;
    const collegeId = this.filterForm.get('college')?.value;
    const groupId = this.filterForm.get('group')?.value;
    this.params = {
      searchQuery: searchQuery,
      collegeId: collegeId,
      groupId: groupId,
      sortField: this.sortKey,
      sortOrder: this.sortDirection,
      testId: testId,
    };
  }

  initializeParam() {
    this.params = {
      collegeId: 0,
      groupId: 0,
      searchQuery: '',
      sortField: '',
      sortOrder: '',
      testId: 0,
      year: 0,
    };
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

  search() {
    this.searchInputValue.next('');
  }

  handleDataSorting(event: Sort) {
    this.sortKey = event.active;
    this.sortDirection = event.direction;
    this.fetchResults();
  }
}
