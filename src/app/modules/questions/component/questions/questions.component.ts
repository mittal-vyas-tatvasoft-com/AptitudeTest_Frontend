import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuestionsService } from '../../services/questions.service';
import {
  Numbers,
  OptionType,
  PaginationDefaultValues,
  QuestionTopic,
  QuestionType,
  StatusCode,
} from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { QuestionCount } from 'src/app/shared/common/interfaces/question-count.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import { Question } from 'src/app/modules/questions/interfaces/question.interface';
import { Subject, debounceTime } from 'rxjs';
import { OptionList, Topics } from '../../static/question.static';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  optionsList: string[] = OptionList;
  questions: any[] = [];
  questionCount: QuestionCount = {
    mathsCount: Numbers.Zero,
    reasoningCount: Numbers.Zero,
    technicalCount: Numbers.Zero,
    totalCount: Numbers.Zero,
  };
  optionType = OptionType;
  questionTopic = QuestionTopic;
  questionType = QuestionType;
  topics = Topics;
  filterForm: FormGroup;
  response: Pagination<Question>;
  topic?: number;
  status?: boolean;
  private scrollSubject = new Subject<number>();

  constructor(
    public dialog: MatDialog,
    private questionService: QuestionsService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeEmptyResponse();
    let win: any = window;
    window.addEventListener('scroll', (event: any) => {
      let percent =
        (window.innerHeight + window.scrollY) / document.body.offsetHeight;
      this.scrollSubject.next(percent);
    });

    const scroller = document.querySelector('.main-content');
    scroller?.addEventListener('scroll', (event: any) => {
      let limit = scroller.scrollHeight - scroller.clientHeight;
      let percent = scroller.scrollTop / limit;
      this.scrollSubject.next(percent);
    });
    this.scrollSubject
      .pipe(debounceTime(Numbers.Debounce))
      .subscribe((data) => {
        if (data > 0.98 && this.response.isNextPage == true) {
          this.loadQuestions(
            this.response.pageSize,
            this.response?.currentPageIndex + Numbers.One,
            this.topic,
            this.status
          );
        }
      });
    this.loadQuestions(
      this.response.pageSize,
      this.response?.currentPageIndex,
      this.topic,
      this.status
    );
    this.getQuestionCount();

    this.filterForm = this.fb.group({
      topic: [''],
      status: [''],
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.topic = res.topic;
      this.status = res.status;
      this.initializeEmptyResponse();
      this.loadQuestions(
        PaginationDefaultValues.DefaultPageSize,
        PaginationDefaultValues.DefaultIndex,
        res.topic,
        res.status
      );
      this.getQuestionCount(res.topic, res.status);
    });
  }

  loadQuestions(
    pageSize: number,
    pageIndex: number,
    topic?: number,
    status?: boolean
  ) {
    this.questionService
      .questions(pageSize, pageIndex, topic, status)
      .subscribe({
        next: (res: any) => {
          if (res.statusCode == StatusCode.Success) {
            this.response = res.data;
            this.questions = [...this.questions, ...this.response.entityList];
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
  }

  getQuestionCount(topic?: number, status?: boolean) {
    this.questionService.getQuestionCount(topic, status).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.questionCount = res.data;
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  initializeEmptyResponse() {
    this.response = {
      currentPageIndex: PaginationDefaultValues.DefaultIndex,
      entityList: [],
      pageSize: PaginationDefaultValues.DefaultPageSize,
      isNextPage: true,
    };
    this.questions = [];
  }
}
