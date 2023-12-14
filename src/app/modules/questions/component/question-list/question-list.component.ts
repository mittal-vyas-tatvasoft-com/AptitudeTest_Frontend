import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  Numbers,
  OptionType,
  PaginationDefaultValues,
  QuestionTopic,
  QuestionType,
  StatusCode,
} from 'src/app/shared/common/enums';
import { UpdateStatus } from 'src/app/shared/common/interfaces/update-status';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { QuestionsService } from '../../services/questions.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { OptionsIndex, Topics } from '../../static/question.static';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import { FormGroup } from '@angular/forms';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Question } from '../../interfaces/question.interface';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  @Input() filterForm?: FormGroup;
  optionType = OptionType;
  questionTopic = QuestionTopic;
  questionType = QuestionType;
  topics = Topics;
  optionIndex = OptionsIndex;
  baseImageUrl = environment.baseURL.slice(0, -4) + 'Files/';
  response: Pagination<Question>;
  topic?: number;
  status?: boolean;
  private scrollSubject = new Subject<number>();
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private questionService: QuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeEmptyResponse();
    if (this.filterForm) {
      this.filterForm.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.topic = res.topic;
          this.status = res.status;
          this.initializeEmptyResponse();
          this.loadQuestions(
            PaginationDefaultValues.DefaultPageSize,
            PaginationDefaultValues.DefaultIndex,
            res.topic,
            res.status
          );
        });
    }
    window.addEventListener('scroll', this.scrollListener);
    this.scrollSubject
      .pipe(debounceTime(Numbers.Debounce), takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        if (data > 0.98 && this.response.isNextPage) {
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
  }

  scrollListener = () => {
    const percent =
      (window.innerHeight + window.scrollY) / document.body.offsetHeight;
    this.scrollSubject.next(percent);
  };

  loadQuestions(
    pageSize: number,
    pageIndex: number,
    topic?: number,
    status?: boolean
  ) {
    this.questionService
      .questions(pageSize, pageIndex, topic, status)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<Pagination<Question>>) => {
          if (res.statusCode == StatusCode.Success) {
            this.response = res.data;
            this.questions = [...this.questions, ...this.response.entityList];
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
  }

  getTopicName(topicId: number) {
    return this.topics.find((x) => x.id == topicId)?.name;
  }

  updateStatus(status: UpdateStatus) {
    this.questionService
      .updateStatus(status)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ResponseModel<number>) => {
          if (res.statusCode == StatusCode.Success) {
            this.questions = this.questions.map((q) => {
              if (q.id == status.id) {
                return { ...q, status: status.status };
              } else {
                return q;
              }
            });
            this.snackbarService.success(res.message);
          } else {
            this.snackbarService.error(res.message);
          }
        },
      });
  }

  handleDeleteProfileDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res: boolean) => {
        if (res) {
          this.questionService
            .delete(id)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res: ResponseModel<null>) => {
                if (res.statusCode == StatusCode.Success) {
                  this.questions = this.questions.filter(
                    (data: Question) => data.id != id
                  );
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
        }
      });
  }

  createDuplicate(id: number) {
    this.router.navigate(['/admin/questions/add-question'], {
      queryParams: { id: id, isDuplicate: true },
    });
  }

  edit(id: number) {
    this.router.navigate(['/admin/questions/add-question'], {
      queryParams: { id: id, isDuplicate: false },
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.scrollSubject.unsubscribe();
    window.removeEventListener('scroll', this.scrollListener);
  }
}
