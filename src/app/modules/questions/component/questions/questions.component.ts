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
import { Question } from 'src/app/shared/common/interfaces/question.interface';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  optionsList: string[] = ['All', 'Active', 'InActive'];
  questions: any[] = [];
  questionCount: QuestionCount = {
    mathsCount: 0,
    reasoningCount: 0,
    technicalCount: 0,
    totalCount: 0,
  };
  optionType = OptionType;
  questionTopic = QuestionTopic;
  questionType = QuestionType;
  topics = [
    {
      id: 1,
      name: 'Maths',
    },
    {
      id: 2,
      name: 'Reasoning',
    },
    {
      id: 3,
      name: 'Technical',
    },
  ];
  filterForm: FormGroup;
  response: Pagination<Question>;
  private scrollSubject = new Subject<number>();

  constructor(
    public dialog: MatDialog,
    private questionService: QuestionsService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeEmptyResponse();

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
            this.response?.currentPageIndex + 1
          );
        }
      });
    this.loadQuestions(this.response.pageSize, this.response?.currentPageIndex);
    this.getQuestionCount();

    this.filterForm = this.fb.group({
      topic: [''],
      status: [''],
    });

    this.filterForm.valueChanges.subscribe((res) => {
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
