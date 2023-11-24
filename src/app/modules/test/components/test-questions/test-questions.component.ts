import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { EditQuestionComponent } from '../../containers/edit-question/edit-question.component';
import {
  AddTestQuestionModel,
  AllInsertedQuestionModel,
  QuestionTopics,
  TopicWiseQuestionData,
} from '../../interfaces/test.interface';
import { TestService } from '../../services/test.service';
import {
  CanNotAddMoreQuestions,
  QuestionCountInitial,
  SelectValidQuestionCount,
} from '../../static/test.static';

@Component({
  selector: 'app-test-questions',
  templateUrl: './test-questions.component.html',
  styleUrls: ['./test-questions.component.scss'],
})
export class TestQuestionsComponent implements OnInit {
  optionsList: SelectOption[] = [
    { value: 'Select', id: '' },
    { value: 'Draft', id: 1 },
    { value: 'Active', id: 2 },
    { value: 'Completed', id: 3 },
  ];

  topicId: number = 0;
  @Input() optionList: SelectOption[] = [];
  @Input() topics: QuestionTopics[] = [];
  @Input() testQuestionsCountData: TopicWiseQuestionData[] = [];
  @Input() allInsertedQuestions: AllInsertedQuestionModel[] = [];
  @Input() totalMarksQuestionsAdded: number = 0;
  @Input() totalQuestionsSelected: number = 0;
  @Input() testId: number;
  @Input() basicTestDetailForm: FormGroup;
  @Input() existingQuestionsTopicId: number[];
  @Output() questionsAddedSuccess = new EventEmitter();
  @Output() deleteTopicWiseQuestions = new EventEmitter<number>();
  @Output() deleteAllQuestions = new EventEmitter();
  form: FormGroup;
  validationMSG: string = '';
  isDataValid: boolean = true;
  singleAnswerQuestionTotalCountTopicWise: number = 0;
  multiAnswerQuestionTotalCountTopicWise: number = 0;
  totalSelectedQuestionsWhileInsert: number = 0;
  totalMarksWhileInsert: number = 0;
  selectedMarkOption = '1';
  singleMarksDropDownData = new BehaviorSubject<any>([]);
  multiMarksDropDownData = new BehaviorSubject<any>([]);
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public validationService: ValidationService,
    private testService: TestService,
    private snackbarService: SnackbarService,
    private candidateService: CandidateService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.testService.singleMarksDropDownData.subscribe((res) => {
      this.singleMarksDropDownData.next(res);
    });
    this.testService.multiMarksDropDownData.subscribe((res) => {
      this.multiMarksDropDownData.next(res);
    });
    this.testService.questionCountSingleAnswer.subscribe(() => {
      this.handleSumOfMarks();
    });
    this.form.get('topicId')?.valueChanges.subscribe((res) => {
      this.form.patchValue({
        numberOfQuestions: '',
        weightage: '',
        oneMarkQuestionSingleAnswer: 0,
        twoMarkQuestionSingleAnswer: 0,
        threeMarkQuestionSingleAnswer: 0,
        fourMarkQuestionSingleAnswer: 0,
        fiveMarkQuestionSingleAnswer: 0,
        oneMarkQuestionMultiAnswer: 0,
        twoMarkQuestionMultiAnswer: 0,
        threeMarkQuestionMultiAnswer: 0,
        fourMarkQuestionMultiAnswer: 0,
        fiveMarkQuestionMultiAnswer: 0,
      });
      if (res) {
        this.topicId = res;
        this.setQuestionCounts();
      } else {
        this.singleAnswerQuestionTotalCountTopicWise = 0;
        this.multiAnswerQuestionTotalCountTopicWise = 0;
        this.testService.questionCountSingleAnswer.next(QuestionCountInitial);
        this.testService.questionCountMultiAnswer.next(QuestionCountInitial);
      }
    });
    this.cdr.detectChanges();
  }

  ngOnChanges() {}

  setQuestionCounts() {
    this.testQuestionsCountData.map((res) => {
      if (res.topicId == this.topicId) {
        this.singleAnswerQuestionTotalCountTopicWise = res.singleAnswerCount;
        this.multiAnswerQuestionTotalCountTopicWise = res.multiAnswerCount;
        this.testService.questionCountSingleAnswer.next(res.singleAnswer);
        this.testService.questionCountMultiAnswer.next(res.multiAnswer);
      }
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      topicId: ['', Validators.required],
      numberOfQuestions: ['', Validators.required],
      weightage: ['', Validators.required],
      oneMarkQuestionSingleAnswer: [0, Validators.required],
      twoMarkQuestionSingleAnswer: [0, Validators.required],
      threeMarkQuestionSingleAnswer: [0, Validators.required],
      fourMarkQuestionSingleAnswer: [0, Validators.required],
      fiveMarkQuestionSingleAnswer: [0, Validators.required],
      oneMarkQuestionMultiAnswer: [0, Validators.required],
      twoMarkQuestionMultiAnswer: [0, Validators.required],
      threeMarkQuestionMultiAnswer: [0, Validators.required],
      fourMarkQuestionMultiAnswer: [0, Validators.required],
      fiveMarkQuestionMultiAnswer: [0, Validators.required],
    });
  }

  ngAfterViewInit() {
    this.testService.questionCountSingleAnswer.next(QuestionCountInitial);
    this.testService.questionCountMultiAnswer.next(QuestionCountInitial);
    this.cdr.detectChanges();
  }

  handleEditQuestionsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '980px';
    this.dialog.open(EditQuestionComponent, dialogConfig);
  }

  handleDeleteQuestionsDialog(topicId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.deleteTopicWiseQuestions.emit(topicId);
        }
      });
  }

  handleDeleteAllQuestionsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.deleteAllQuestions.emit();
        }
      });
  }

  handleValidateSelectedMarks(
    sum: number,
    totalMarksQuestionsAdded: number,
    basicTestMarks: number
  ) {
    const remainingMarks = basicTestMarks - totalMarksQuestionsAdded - sum;

    if (remainingMarks < 0) {
      this.validationMSG = CanNotAddMoreQuestions;
      this.isDataValid = false;
    } else {
      this.validationMSG = '';
      this.isDataValid = true;
    }
  }

  handleSumOfMarks() {
    let data = this.testService.CheckSumAndSelectedQuestions(this.form);
    this.totalSelectedQuestionsWhileInsert = data.totalQuestionsSelected;
    this.totalMarksWhileInsert = data.sum;
    this.totalQuestionsSelected = data.totalQuestionsSelected;
    if (
      data.totalQuestionsSelected != this.form.get('numberOfQuestions')?.value
    ) {
      this.validationMSG = SelectValidQuestionCount;
      this.isDataValid = false;
      return;
    }
    const basicTestMarks = this.basicTestDetailForm.get('basicPoints')?.value;

    this.handleValidateSelectedMarks(
      data.sum,
      this.totalMarksQuestionsAdded,
      basicTestMarks
    );
  }

  addQuestions() {
    const payload: AddTestQuestionModel = {
      testId: this.basicTestDetailForm.get('testId')?.value,
      topicId: this.form.get('topicId')?.value,
      NoOfQuestions: this.form.get('numberOfQuestions')?.value,
      createdBy: 1,
      weightage: this.form.get('weightage')?.value,
      testQuestionsCount: [
        {
          questionType: 1,
          oneMarkQuestion: this.form.get('oneMarkQuestionSingleAnswer')?.value,
          twoMarkQuestion: this.form.get('twoMarkQuestionSingleAnswer')?.value,
          threeMarkQuestion: this.form.get('threeMarkQuestionSingleAnswer')
            ?.value,
          fourMarkQuestion: this.form.get('fourMarkQuestionSingleAnswer')
            ?.value,
          fiveMarkQuestion: this.form.get('fiveMarkQuestionSingleAnswer')
            ?.value,
        },
        {
          questionType: 2,
          oneMarkQuestion: this.form.get('oneMarkQuestionMultiAnswer')?.value,
          twoMarkQuestion: this.form.get('twoMarkQuestionMultiAnswer')?.value,
          threeMarkQuestion: this.form.get('threeMarkQuestionMultiAnswer')
            ?.value,
          fourMarkQuestion: this.form.get('fourMarkQuestionMultiAnswer')?.value,
          fiveMarkQuestion: this.form.get('fiveMarkQuestionMultiAnswer')?.value,
        },
      ],
      updatedBy: 0,
    };

    this.testService.addTestQuestions(payload).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.snackbarService.success(res.message);
          this.form.reset();
          this.questionsAddedSuccess.emit();
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }
}
