import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditQuestionComponent } from '../edit-question/edit-question.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  testBasicDetailFormModel,
  testGroupFilterModel,
  testGroupFormModel,
} from '../../config/test.configs';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import {
  GetAllTestCandidateParams,
  createTestModel,
  testCandidatesModel,
} from '../../interfaces/test.interface';
import { TestService } from '../../services/test.service';
import { DatePipe } from '@angular/common';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { AdminModel } from 'src/app/modules/masters/admin/interfaces/admin.interface';
import { Subject, debounceTime } from 'rxjs';
import { DateTime } from 'luxon';
import * as moment from 'moment';

export interface CandidateData {
  candidate: string;
  college: string;
  email: string;
  contact: string;
}

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss'],
})
export class CreateTestComponent {
  optionsList: SelectOption[] = [
    { value: 'Select', id: '' },
    { value: 'Draft', id: 1 },
    { value: 'Active', id: 2 },
    { value: 'Completed', id: 3 },
  ];
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  sortKey: string = '';
  sortDirection: string = '';
  minDate: Date = new Date();
  startEndTimeDifferenceValid: boolean = true;
  isPagination: boolean = false;
  testId: number = 0;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  selectedMarkOption = '1';
  markList: string[] = ['1', '2', '3', '4', '5'];
  selectedOption = '10';

  displayedColumns: TableColumn<testCandidatesModel>[] = [
    { columnDef: 'candidateName', header: 'Candidate Name' },
    { columnDef: 'collegeName', header: 'College Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'phoneNumber', header: 'Contact Number' },
  ];
  basicTestDetails: FormGroup;
  testGroupForm: FormGroup;
  testGroupFilterForm: FormGroup;
  testBasicDetailFormModel = testBasicDetailFormModel;
  testGroupFormModel = testGroupFormModel;
  testGroupFilterModel = testGroupFilterModel;
  public smallScreen: boolean = window.innerWidth < 767;
  startTime: Date;
  endTime: Date;
  @ViewChild('stepper') stepper!: MatStepper;
  private searchInputValue = new Subject<string>();

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.smallScreen = window.innerWidth < 767;
  }

  dataSource: MatTableDataSource<testCandidatesModel>;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public validationService: ValidationService,
    private testService: TestService,
    private snackbarService: SnackbarService,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.createForms();

    this.testGroupForm.get('groupId')?.valueChanges.subscribe((res) => {
      if (res != null) {
        this.fetchTestCandidates();
      } else {
        this.isPagination = false;
      }
    });
  }

  ngAfterViewInit() {
    this.getDropDownData();

    this.searchInputValue
      .pipe(
        debounceTime(Numbers.Debounce) // Adjust the debounce time as needed
      )
      .subscribe(() => {
        if (this.testGroupForm.get('groupId')?.value != '') {
          this.fetchTestCandidates();
        }
      });
  }

  handleSelectionChange() {
    this.fetchTestCandidates();
  }

  fetchTestCandidates() {
    if (this.testId != 0 && this.testGroupForm.get('groupId')?.value != '') {
      const params: GetAllTestCandidateParams = {
        searchQuery: this.testGroupFilterForm.get('searchQuery')?.value,
        groupId: this.testGroupForm.get('groupId')?.value,
        currentPageIndex: this.currentPageIndex,
        pageSize: this.pageSize,
        sortField: this.sortKey,
        sortOrder: this.sortDirection,
        collegeId: this.testGroupFilterForm.get('collegeId')?.value,
      };
      this.testService.getAllTestCandidates(params).subscribe({
        next: (res) => {
          if (res.data != null) {
            this.dataSource = new MatTableDataSource(res.data);
          }

          if (res.data[0].totalRecords != null) {
            this.totalItemsCount = res.data[0].totalRecords;
          }
        },
      });
    } else {
      this.dataSource = new MatTableDataSource();
      this.isPagination = false;
    }
  }

  searchTestCandidates() {
    const group = this.testGroupForm.get('groupId')?.value;
    const searchValue = this.testGroupFilterForm.get('searchQuery')?.value;
    if (group != null) {
      this.searchInputValue.next(searchValue);
    }
  }

  getDropDownData() {
    this.groups.push({ value: 'Select', id: '' });
    this.colleges.push({ value: 'Select', id: '' });
    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      groups.forEach((element) => {
        this.groups.push({ value: element.name, id: element.id });
      });
    });
    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      colleges.forEach((element) => {
        this.colleges.push({ value: element.name.toString(), id: element.id });
      });
    });
  }

  createForms() {
    this.basicTestDetails = this.formBuilder.group({
      testName: ['', Validators.required],
      status: [1, Validators.required],
      basicPoints: ['', Validators.required],
      testDuration: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      messageAtTheStartOfTest: [''],
      messageAtTheEndOfTest: [''],
      randomQuestions: [false],
      randomAnswers: [false],
      logoutWhenTimeExpires: [false],
      questignsMenu: [false],
    });

    this.testGroupForm = this.formBuilder.group({
      groupId: ['', Validators.required],
    });

    this.testGroupFilterForm = this.formBuilder.group({
      collegeId: [''],
      searchQuery: [''],
    });
  }

  onTimeSet(selectedTime: string) {
    const today = new Date(Date.now());
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':');
    if (period === 'AM' && hours !== '12') {
      today.setHours(Number(hours));
    } else if (period === 'PM' && hours !== '12') {
      today.setHours(Number(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      today.setHours(Number('00'));
    } else {
      today.setHours(Number(hours));
    }
    today.setMinutes(Number(minutes));

    return moment.utc(today).toDate();
  }

  handleNextClick() {
    this.stepper.next();
  }

  handleEditQuestionDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '980px';
    this.dialog.open(EditQuestionComponent, dialogConfig);
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

  saveBasicDetails() {
    const date = this.basicTestDetails.get('date')?.value.utc()._d;
    const payload: createTestModel = {
      name: this.basicTestDetails.get('testName')?.value,
      testDuration: this.basicTestDetails.get('testDuration')?.value,
      date: date,
      startTime: this.onTimeSet(this.basicTestDetails.get('startTime')?.value),
      endTime: this.onTimeSet(this.basicTestDetails.get('endTime')?.value),
      description: this.basicTestDetails.get('description')?.value,
      basicPoint: this.basicTestDetails.get('basicPoints')?.value,
      status: this.basicTestDetails.get('status')?.value,
      messaageAtStartOfTheTest: this.basicTestDetails.get(
        'messageAtTheStartOfTest'
      )?.value,
      messaageAtEndOfTheTest: this.basicTestDetails.get('messageAtTheEndOfTest')
        ?.value,
      isRandomQuestion: this.basicTestDetails.get('randomQuestions')?.value,
      isRandomAnswer: this.basicTestDetails.get('randomAnswers')?.value,
      isLogoutWhenTimeExpire: this.basicTestDetails.get('logoutWhenTimeExpires')
        ?.value,
      isQuestionsMenu: this.basicTestDetails.get('questignsMenu')?.value,
      createdBy: 1,
    };

    if (this.startEndTimeDifferenceValid && this.basicTestDetails.valid) {
      this.testService.createTest(payload).subscribe({
        next: (res) => {
          if ((res.statusCode = StatusCode.Success)) {
            this.testId = res.data;
            this.fetchTestCandidates();
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
    }
  }

  updateTestGroup() {
    if (this.testId != 0) {
      const groupId = this.testGroupForm.get('groupId')?.value;
      this.testService.updateTestGroup(this.testId, groupId).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
    }
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageIndex = 0;
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - 1;
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === 0;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - 1;
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'candidateName':
        this.sortKey = 'CandidateName';
        this.sortDirection = event.direction;
        break;

      case 'collegeName':
        this.sortKey = 'CollegeName';
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

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }

    this.fetchTestCandidates();
  }
}
