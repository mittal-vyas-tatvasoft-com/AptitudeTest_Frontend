import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { QuestionType, StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { AddTestQuestionModel } from '../../interfaces/test.interface';
import { TestService } from '../../services/test.service';
import {
  CanNotAddMoreQuestions,
  MarksAvailable,
  QuestionCountInitial,
  SelectValidQuestionCount,
} from '../../static/test.static';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
})
export class EditQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedMarkOption = '1';
  markList: string[] = ['1', '2', '3', '4', '5'];
  validationMSG: string;
  isDataValid: boolean;
  totalSelectedQuestionsWhileInsert: number;
  totalMarksWhileInsert: number;
  totalQuestionsSelected: number;
  totalMarksQuestionsAdded: number;
  singleMarksDropDownData = new BehaviorSubject<any>([]);
  multiMarksDropDownData = new BehaviorSubject<any>([]);
  singleAnswerQuestionTotalCountTopicWise = 0;
  multiAnswerQuestionTotalCountTopicWise = 0;
  existingQuestionsTopicId: number[] = [];
  topicId = 0;
  MarksAvailable = MarksAvailable;
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.singleMarksDropDownData = this.data.singleMarksDropDownData;
    this.multiMarksDropDownData = this.data.multiMarksDropDownData;
    this.createForm();
    this.form.get('topicId')?.valueChanges.subscribe((res) => {
      this.resetFields();
      if (res) {
        this.topicId = res;
        this.setQuestionCounts();
        this.cdr.detectChanges();
      } else {
        this.singleAnswerQuestionTotalCountTopicWise = 0;
        this.multiAnswerQuestionTotalCountTopicWise = 0;
        this.testService.questionCountSingleAnswer.next(QuestionCountInitial);
        this.testService.questionCountMultiAnswer.next(QuestionCountInitial);
      }
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      topicId: ['', Validators.required],
      numberOfQuestions: ['', Validators.required],
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
    this.form
      .get('topicId')
      ?.setValue(this.data.topicWiseQuestionCount.topicId);
    this.form
      .get('numberOfQuestions')
      ?.setValue(this.data.topicWiseQuestionCount.totalQuestions);
    this.topicId = this.data.topicWiseQuestionCount.topicId;
    this.form.patchValue({
      oneMarkQuestionSingleAnswer:
        this.data.topicWiseQuestionCount.singleAnswer.oneMarkQuestion,
      twoMarkQuestionSingleAnswer:
        this.data.topicWiseQuestionCount.singleAnswer.twoMarkQuestion,
      threeMarkQuestionSingleAnswer:
        this.data.topicWiseQuestionCount.singleAnswer.threeMarkQuestion,
      fourMarkQuestionSingleAnswer:
        this.data.topicWiseQuestionCount.singleAnswer.fourMarkQuestion,
      fiveMarkQuestionSingleAnswer:
        this.data.topicWiseQuestionCount.singleAnswer.fiveMarkQuestion,
      oneMarkQuestionMultiAnswer:
        this.data.topicWiseQuestionCount.multiAnswer.oneMarkQuestion,
      twoMarkQuestionMultiAnswer:
        this.data.topicWiseQuestionCount.multiAnswer.twoMarkQuestion,
      threeMarkQuestionMultiAnswer:
        this.data.topicWiseQuestionCount.multiAnswer.threeMarkQuestion,
      fourMarkQuestionMultiAnswer:
        this.data.topicWiseQuestionCount.multiAnswer.fourMarkQuestion,
      fiveMarkQuestionMultiAnswer:
        this.data.topicWiseQuestionCount.multiAnswer.fiveMarkQuestion,
    });
    this.cdr.detectChanges();
  }

  setQuestionCounts() {
    this.data.testQuestionsCountData.map((res: any) => {
      if (res.topicId == this.topicId) {
        this.singleAnswerQuestionTotalCountTopicWise = res.singleAnswerCount;
        this.multiAnswerQuestionTotalCountTopicWise = res.multiAnswerCount;
        this.testService.questionCountSingleAnswer.next(res.singleAnswer);
        this.testService.questionCountMultiAnswer.next(res.multiAnswer);
      }
    });
  }

  resetFields() {
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
  }

  closeModal() {
    this.dialogRef.close();
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
    const data = this.testService.CheckSumAndSelectedQuestions(this.form);

    this.totalSelectedQuestionsWhileInsert = data.totalQuestionsSelected;
    this.totalMarksWhileInsert = data.sum;
    this.totalQuestionsSelected = data.totalQuestionsSelected;
    const remainingMarks = this.data.basicPoints - data.sum;
    if (
      data.totalQuestionsSelected != this.form.get('numberOfQuestions')?.value
    ) {
      this.validationMSG = SelectValidQuestionCount;
      this.isDataValid = false;
      return;
    } else if (remainingMarks < 0) {
      this.validationMSG = CanNotAddMoreQuestions;
      this.isDataValid = false;
      return;
    } else {
      this.validationMSG = '';
      this.isDataValid = true;
    }
  }

  updateMarks() {
    const payload: AddTestQuestionModel = {
      testId: this.data.testId,
      createdBy: 1,
      updatedBy: 1,
      topicId: this.topicId,
      NoOfQuestions: this.form.get('numberOfQuestions')?.value,
      testQuestionsCount: [
        {
          questionType: QuestionType.SingleAnswer,
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
          questionType: QuestionType.MultiAnswer,
          oneMarkQuestion: this.form.get('oneMarkQuestionMultiAnswer')?.value,
          twoMarkQuestion: this.form.get('twoMarkQuestionMultiAnswer')?.value,
          threeMarkQuestion: this.form.get('threeMarkQuestionMultiAnswer')
            ?.value,
          fourMarkQuestion: this.form.get('fourMarkQuestionMultiAnswer')?.value,
          fiveMarkQuestion: this.form.get('fiveMarkQuestionMultiAnswer')?.value,
        },
      ],
      weightage: +this.form.get('weightage')?.value,
    };
    this.testService.UpdateTestQuestions(payload).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.dialogRef.close(true);
          this.snackbarService.success(res.message);
        } else {
          this.dialogRef.close(true);
          this.snackbarService.error(res.message);
        }
      },
    });
  }
}
