import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { Numbers, StatusCode, TestStatus } from 'src/app/shared/common/enums';
import { TestData, TestQueryParams } from '../../interfaces/test.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { testFilterModel } from '../../config/test.configs';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { DropdownData } from 'src/app/shared/common/interfaces/dropdown-data.interface';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  sortField = '';
  sortOrder = '';
  pageNumbers: number[] = [];
  form: FormGroup;
  formData = testFilterModel;
  dataSource!: MatTableDataSource<TestData>;
  displayedColumns: TableColumn<TestData>[] = [
    { columnDef: 'testName', header: 'Test' },
    { columnDef: 'groupName', header: 'Group' },
    { columnDef: 'testTime', header: 'Test Time' },
    { columnDef: 'startTime', header: 'Start Time' },
    { columnDef: 'endTime', header: 'End Time' },
    { columnDef: 'noOfCandidates', header: 'No. Of Candidates' },
    { columnDef: 'status', header: 'Status' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
    },
  ];

  statusList: SelectOption[] = [
    { value: 'All', id: '' },
    { value: 'Active', id: TestStatus.Active },
    { value: 'Draft', id: TestStatus.Draft },
    { value: 'Completed', id: TestStatus.Completed },
  ];
  groupList: SelectOption[] = [{ value: 'All', id: '' }];
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private testService: TestService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.testService.getGroups().subscribe({
      next: (res: ResponseModel<DropdownData[]>) => {
        const tempData: SelectOption[] = res.data.map((data) => {
          return {
            id: data.id,
            value: data.name,
          };
        });
        this.groupList = [...this.groupList, ...tempData];
      },
    });

    this.dataSource = new MatTableDataSource<TestData>([]);
    this.getTests();
    this.form.valueChanges.pipe(debounceTime(Numbers.Debounce)).subscribe({
      next: () => {
        this.currentPageIndex = 0;
        this.pageSize = 10;
        this.sortField = '';
        this.sortOrder = '';
        this.getTests();
      },
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      searchQuery: [''],
      groupId: [null],
      status: [null],
      date: [null],
    });
  }

  getTests() {
    const searchQuery = this.form.get('searchQuery')?.value;
    const groupId = this.form.get('groupId')?.value;
    const status = this.form.get('status')?.value;
    const date = this.form.get('date')?.value;
    let filterDate: Date | null = null;
    if (date != null && date != '') {
      filterDate = date.toDate();
    }
    const data: TestQueryParams = {
      currentPageIndex: this.currentPageIndex,
      pageSize: this.pageSize,
      searchQuery: searchQuery,
      groupId: groupId,
      status: status,
      date: filterDate,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };
    this.testService
      .getTests(data)
      .subscribe((res: ResponseModel<TestData[]>) => {
        if (res.statusCode != StatusCode.Success) {
          this.snackbarService.error(res.message);
        } else {
          this.dataSource = new MatTableDataSource<TestData>(res.data);
          if (res.data.length != 0) {
            this.totalItemsCount = res.data[0].totalRecords;
          }
        }
      });
  }

  handleDeleteTestDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef?.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.testService.delete(id).subscribe({
          next: (res: ResponseModel<string>) => {
            if (res.statusCode == StatusCode.Success) {
              this.getTests();
              this.snackbarService.success(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
      }
    });
  }

  handleEditTest(event: TestData) {
    this.router.navigate(['/admin/tests/create'], {
      queryParams: { id: event.id },
    });
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'testName':
        this.sortField = 'TestName';
        this.sortOrder = event.direction;
        break;

      case 'groupName':
        this.sortField = 'GroupName';
        this.sortOrder = event.direction;
        break;

      case 'testTime':
        this.sortField = 'TestTime';
        this.sortOrder = event.direction;
        break;

      case 'startTime':
        this.sortField = 'StartTime';
        this.sortOrder = event.direction;
        break;

      case 'endTime':
        this.sortField = 'EndTime';
        this.sortOrder = event.direction;
        break;

      case 'noOfCandidates':
        this.sortField = 'NoOfCandidates';
        this.sortOrder = event.direction;
        break;

      default:
        this.sortField = '';
        this.sortOrder = '';
        break;
    }
    this.getTests();
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageIndex = Numbers.Zero;
    this.getTests();
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.getTests();
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.getTests();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  resetForm() {
    this.form.setValue({
      searchQuery: '',
      groupId: '',
      status: '',
      date: '',
    });
    this.getTests();
  }
}
