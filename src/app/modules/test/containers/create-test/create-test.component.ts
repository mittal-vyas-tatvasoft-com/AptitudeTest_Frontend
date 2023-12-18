import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  testBasicDetailFormModel,
  testGroupFilterModel,
  testGroupFormModel,
} from '../../config/test.configs';
import {
  AllInsertedQuestionModel,
  CreateTestModel,
  GetAllTestCandidateParams,
  TestCandidatesModel,
  TopicWiseQuestionData,
} from '../../interfaces/test.interface';
import { TestService } from '../../services/test.service';
import { Topics } from '../../static/test.static';

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
export default class CreateTestComponent implements OnInit, AfterViewInit {
  optionsList: SelectOption[] = [
    { value: 'Select', id: '' },
    { value: 'Draft', id: 1 },
    { value: 'Active', id: 2 },
    { value: 'Completed', id: 3 },
  ];
  topics = Topics;
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  sortKey = '';
  sortDirection = '';
  minDate: Date;
  startEndTimeDifferenceValid = true;
  isPagination = false;
  testId = 0;
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  selectedMarkOption = '1';
  markList: string[] = ['1', '2', '3', '4', '5'];
  selectedOption = '10';
  getMinTime: string;

  displayedColumns: TableColumn<TestCandidatesModel>[] = [
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
  allInsertedQuestions: AllInsertedQuestionModel[] = [];
  totalMarksQuestionsAdded = 0;
  startTime: Date;
  endTime: Date;
  testQuestionsCountData: TopicWiseQuestionData[] = [];
  existingQuestionsTopicId: number[] = [];
  @ViewChild('stepper') stepper!: MatStepper;
  isEditMode = false;
  public smallScreen: boolean = window.innerWidth < 767;
  private searchInputValue = new Subject<string>();

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.smallScreen = window.innerWidth < 767;
  }

  dataSource: MatTableDataSource<TestCandidatesModel>;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public validationService: ValidationService,
    private testService: TestService,
    private snackbarService: SnackbarService,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
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

    this.fetchAllInsertedQuestions();
  }

  createForms() {
    this.basicTestDetails = this.formBuilder.group({
      testId: [0],
      testName: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
      status: [1, Validators.required],
      basicPoints: ['', Validators.required],
      negativeMarkingPercentage: [
        0,
        [Validators.max(100), Validators.min(0), Validators.required],
      ],
      testDuration: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.whitespaceREGEX),
        ],
      ],
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

  ngAfterViewInit() {
    this.getDropDownData();
    this.activatedRoute.queryParams.subscribe((res) => {
      if (res['id']) {
        this.isEditMode = true;
        this.testId = res['id'];
        this.testService.GetTestById(+res['id']).subscribe((res: any) => {
          if (res.statusCode == StatusCode.Success) {
            const startTime = this.getTime(new Date(res.data.startTime));
            const endTime = this.getTime(new Date(res.data.endTime));
            const d = new Date(res.data.date);
            // This will return an ISO string matching your local time.
            const utcDate = new Date(
              d.getFullYear(),
              d.getMonth(),
              d.getDate(),
              d.getHours(),
              d.getMinutes() - d.getTimezoneOffset()
            ).toISOString();
            this.basicTestDetails.setValue({
              testId: res.data.id,
              testName: res.data.name,
              status: res.data.status,
              negativeMarkingPercentage: res.data.negativeMarkingPercentage,
              basicPoints: res.data.basicPoint,
              testDuration: +res.data.testDuration,
              date: utcDate,
              startTime: startTime,
              endTime: endTime,
              description: res.data.description,
              messageAtTheStartOfTest: res.data.messaageAtStartOfTheTest,
              messageAtTheEndOfTest: res.data.messaageAtEndOfTheTest,
              randomQuestions: res.data.isRandomQuestion,
              randomAnswers: res.data.isRandomAnswer,
              logoutWhenTimeExpires: res.data.isLogoutWhenTimeExpire,
              questignsMenu: res.data.isQuestionsMenu,
            });
            this.testGroupForm.setValue({
              groupId: res.data.groupId,
            });
            this.fetchAllInsertedQuestions();
          } else {
            this.snackbarService.error(res.message);
          }
        });
        this.cdr.detectChanges();
        return true;
      } else {
        if (!this.isEditMode) {
          const now = new Date();
          this.getMinTime = `${now.getHours()}:${now.getMinutes()}`;
        }

        this.minDate = new Date();
        return false;
      }
    });
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

  getTime(data: Date) {
    const date = new Date(data);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;
    return formattedTime;
  }

  handleSelectionChange() {
    this.fetchTestCandidates();
  }

  clearFilter() {
    this.testGroupFilterForm.get('collegeId')?.setValue('');
    this.testGroupFilterForm.get('searchQuery')?.setValue('');
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

  fetchAllInsertedQuestions() {
    this.testService.GetTopicWiseQuestionsCount().subscribe({
      next: (res) => {
        if (res.statusCode === StatusCode.Success) {
          this.testQuestionsCountData = res.data;
          this.topics.forEach((topic) => {
            res.data.forEach((data) => {
              if (topic.id === data.topicId) {
                topic.questionCount = data.totalQuestions;
              }
            });
          });
        }
      },
    });
    if (this.basicTestDetails.get('testId')?.value != 0) {
      this.testService.GetAllInsertedQuestions(this.testId).subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.existingQuestionsTopicId = [];
            res.data.questionsCount.forEach((element) => {
              this.existingQuestionsTopicId.push(element.topicId);
            });
            this.allInsertedQuestions = [];
            this.allInsertedQuestions.push(res.data);
            this.totalMarksQuestionsAdded = res.data.totalMarks;
          }
        },
      });
    }
  }

  fetchInsertedQuestionsAgain() {
    this.allInsertedQuestions = [];
    this.existingQuestionsTopicId = [];
    this.fetchAllInsertedQuestions();
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

  onTimeSet(date: Date, selectedTime: string) {
    const today = date;
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
    return this.getDateFormatted(today);
  }

  handleNextClick() {
    this.stepper.next();
  }

  getDateFormatted(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes() - date.getTimezoneOffset()
    );
  }

  saveBasicDetails() {
    const d = new Date(this.basicTestDetails.get('date')?.value);
    // This will return an ISO string matching your local time.
    const utcDate = this.getDateFormatted(d);
    const payload: CreateTestModel = {
      id: this.basicTestDetails.get('testId')?.value,
      name: this.basicTestDetails.get('testName')?.value,
      testDuration: this.basicTestDetails.get('testDuration')?.value,
      date: utcDate,
      startTime: this.onTimeSet(
        utcDate,
        this.basicTestDetails.get('startTime')?.value
      ),
      endTime: this.onTimeSet(
        utcDate,
        this.basicTestDetails.get('endTime')?.value
      ),
      description: this.basicTestDetails.get('description')?.value,
      basicPoint: this.basicTestDetails.get('basicPoints')?.value,
      negativeMarkingPercentage: this.basicTestDetails.get(
        'negativeMarkingPercentage'
      )?.value,
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
      if (this.basicTestDetails.get('testId')?.value == 0) {
        this.testService.createTest(payload).subscribe({
          next: (res) => {
            if (res.statusCode == StatusCode.Success) {
              this.basicTestDetails.get('testId')?.setValue(res.data);
              this.testId = res.data;
              this.fetchTestCandidates();
              this.stepper.next();
              this.snackbarService.success(res.message);
            } else if (res.statusCode != StatusCode.AlreadyExist) {
              this.router.navigate(['/admin/tests']);
              this.snackbarService.error(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (res) => {
            this.snackbarService.error(res.message);
          },
        });
      } else {
        this.testService.updateTest(payload).subscribe({
          next: (res) => {
            if (res.statusCode == StatusCode.Success) {
              this.stepper.next();
              this.snackbarService.success(res.message);
            } else if (res.statusCode != StatusCode.AlreadyExist) {
              this.router.navigate(['/admin/tests']);
              this.snackbarService.error(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (res) => {
            this.snackbarService.error(res.message);
          },
        });
      }
    }
  }

  updateTestGroup() {
    if (this.testId != 0) {
      const groupId = this.testGroupForm.get('groupId')?.value;
      this.testService.updateTestGroup(this.testId, groupId).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.snackbarService.success(res.message);
            this.stepper.next();
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
    }
  }

  questionsAddedSuccess() {
    this.fetchAllInsertedQuestions();
  }

  deleteQuestions(topicId: number) {
    if (topicId != 0) {
      this.testService
        .DeleteTopicWiseTestQuestions(this.testId, topicId)
        .subscribe({
          next: (res) => {
            this.allInsertedQuestions = [];
            this.existingQuestionsTopicId = [];
            this.fetchAllInsertedQuestions();
            if (res.statusCode == StatusCode.Success) {
              this.snackbarService.success(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
    } else {
      this.testService.DeleteAllTestQuestions(this.testId).subscribe({
        next: (res) => {
          this.allInsertedQuestions = [];
          this.existingQuestionsTopicId = [];
          this.fetchAllInsertedQuestions();
          if (res.statusCode == StatusCode.Success) {
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
