import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import {
  Numbers,
  StaticMessages,
  StatusCode,
  TestStatus,
} from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { testFilterModel } from '../../config/test.configs';
import {
  TestData,
  TestQueryParams,
  UpdateTestStatus,
} from '../../interfaces/test.interface';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, AfterViewInit {
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  sortField = '';
  sortOrder = '';
  defaultGroupId: number;
  pageNumbers: number[] = [];
  testIds: number[] = [];
  form: FormGroup;
  formData = testFilterModel;
  isButtonHovered: boolean = false;
  dataSource!: MatTableDataSource<TestData>;
  displayedColumns: TableColumn<TestData>[] = [
    { columnDef: 'select', header: '', width: '5%' },
    { columnDef: 'testName', header: 'Test', width: '20%' },
    { columnDef: 'groupName', header: 'Group', width: '15%' },
    { columnDef: 'testTime', header: 'Test Time', width: '10%' },
    { columnDef: 'date', header: 'Date', width: '10%' },
    { columnDef: 'startTime', header: 'Start Time', width: '10%' },
    { columnDef: 'endTime', header: 'End Time', width: '10%' },
    { columnDef: 'noOfCandidates', header: 'No. Of Candidates', width: '10%' },
    { columnDef: 'status', header: 'Status', width: '10%' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
      width: '5%',
    },
  ];

  statusList: SelectOption[] = [
    { value: 'All', id: '' },
    { value: 'Active', id: TestStatus.Active },
    { value: 'Draft', id: TestStatus.Draft },
    { value: 'Completed', id: TestStatus.Completed },
  ];
  groupList: SelectOption[] = [{ value: 'All', id: '' }];
  groups: SelectOption[] = [];
  nonDefaultGroups: SelectOption[] = [];
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('testTable') testTable: TableComponent<any>;
  candidateService: CandidateService;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private testService: TestService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.testService.getGroups().subscribe((groupElements) => {
      groupElements.data.forEach((groupElement) => {
        if (groupElement.isDefault) {
          const defaultGroupName = groupElement.name + ' (Default Group) ';
          this.groupList.push({ value: defaultGroupName, id: groupElement.id });
        }
      });
      groupElements.data.forEach((groupElement) => {
        if (!groupElement.isDefault) {
          this.groupList.push({
            value: groupElement.name,
            id: groupElement.id,
          });
        }
      });
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
      groupId: [''],
      status: [null],
      date: [null],
    });
  }

  ngAfterViewInit(): void {
    this.testService.getGroups().subscribe((groups) => {
      groups.data.forEach((group) => {
        if (group.isDefault) {
          this.defaultGroupId = group.id;
          this.form.get('groupId')?.setValue(group.id);
        }
      });
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
          res.data = res.data?.map((record: TestData) => {
            return {
              ...record,
              date: this.getTrimmedDate(record.startTime),
              startTime: this.getTrimmedTime(record.startTime),
              endTime: this.getTrimmedTime(record.endTime),
            };
          });
          this.dataSource = new MatTableDataSource<TestData>(res.data);
          if (res.data.length != 0) {
            this.totalItemsCount = res.data[0].totalRecords;
          }
        }
      });
  }

  handleMultipleTestDelete() {
    this.testIds = this.testTable.getSelectedTestIds();
    if (this.testIds && this.testIds.length > 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['confirmation-dialog'];
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(
        DeleteConfirmationDialogComponent,
        dialogConfig
      );
      dialogRef?.afterClosed().subscribe((result: any) => {
        if (result) {
          this.testService.deleteMultiple(this.testIds).subscribe({
            next: (res: any) => {
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
      this.testTable.selection.clear();
    } else {
      this.snackbarService.warn(StaticMessages.SelectRow);
    }
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
              this.testTable.selection.clear();
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

  handleTestGeneration(id: number) {
    this.testService.generateTests(id).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.statusCode == StatusCode.Success) {
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
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

      case 'date':
        this.sortField = 'Date';
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

  appendPad(unit: any) {
    return unit > 9 ? unit : `0` + unit;
  }

  getTrimmedTime(date: string) {
    let tempDate = new Date(date);
    const hours = tempDate.getHours();
    const minutes = tempDate.getMinutes();
    const formattedTime = `${this.appendPad(hours)}:${this.appendPad(minutes)}`;
    return formattedTime;
  }

  getTrimmedDate(date: string) {
    let tempDate = new Date(date);
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth() + 1;
    const day = tempDate.getDate();
    const formattedDate = `${this.appendPad(day)}/${this.appendPad(
      month
    )}/${year}`;
    return formattedDate;
  }

  handleTestStatus(data: { row: number; action: number }) {
    const payload: UpdateTestStatus = {
      id: data.row,
      status: data.action,
    };
    this.testService.updateTestStatus(payload).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.getTests();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.warn(res.message);
        }
      },
    });
  }
}
