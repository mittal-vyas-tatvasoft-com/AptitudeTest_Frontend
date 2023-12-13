import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResultsService } from '../../services/results.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  ResultDetails,
  ResultDetailsParam,
  ResultQuestion,
} from '../../interfaces/result.interface';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import {
  Numbers,
  OptionType,
  PaginationDefaultValues,
} from 'src/app/shared/common/enums';
import { OptionsIndex } from 'src/app/modules/questions/static/question.static';
import { environment } from 'src/environments/environment';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { StatusCode } from 'src/app/shared/common/enums';
@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss'],
})
export class ResultDetailsComponent implements OnInit, OnDestroy {
  id: number;
  testId: number;
  marks: number = 0;
  currentCount: number = 0;
  optionIndex = OptionsIndex;
  baseImageUrl = environment.baseURL.slice(0, -4) + 'Files/';
  data: Pagination<ResultQuestion>;
  resultDetails: ResultDetails;
  optionType = OptionType;
  private scrollSubject = new Subject<number>();
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private resultService: ResultsService,
    public snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initializeEmptyResponse();
    this.route.params.subscribe(({ id, testId }) => {
      this.id = Number(id);
      this.testId = Number(testId);
      this.getResultDetails();
    });
    window.addEventListener('scroll', this.scrollListener);

    this.scrollSubject
      .pipe(debounceTime(Numbers.Debounce), takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        if (data > 0.98 && this.data.isNextPage) {
          this.getResultDetails();
        }
      });
  }

  handleBackBtn() {
    this._location.back();
  }

  filterOnMarks(marks: number) {
    this.marks = marks;
    this.initializeEmptyResponse();
    this.getResultDetails();
  }

  getResultDetails() {
    const param: ResultDetailsParam = {
      id: this.id,
      testId: this.testId,
      marks: this.marks,
      pageIndex: this.data.currentPageIndex,
      pagesize: 10,
    };

    this.resultService.getResultsDetails(param).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.data.entityList = [
            ...this.data.entityList,
            ...res.data.paginatedData.entityList,
          ];
          const temp = res.data;
          this.resultDetails.allCorrectQuestionCount =
            temp.allCorrectQuestionCount;
          this.resultDetails.allQuestionCount = temp.allQuestionCount;
          this.resultDetails.marks1CorrectQuestionCount =
            temp.marks1CorrectQuestionCount;
          this.resultDetails.marks2CorrectQuestionCount =
            temp.marks2CorrectQuestionCount;
          this.resultDetails.marks3CorrectQuestionCount =
            temp.marks3CorrectQuestionCount;
          this.resultDetails.marks4CorrectQuestionCount =
            temp.marks4CorrectQuestionCount;
          this.resultDetails.marks5CorrectQuestionCount =
            temp.marks5CorrectQuestionCount;
          this.resultDetails.marks1QuestionCount = temp.marks1QuestionCount;
          this.resultDetails.marks2QuestionCount = temp.marks2QuestionCount;
          this.resultDetails.marks3QuestionCount = temp.marks3QuestionCount;
          this.resultDetails.marks4QuestionCount = temp.marks4QuestionCount;
          this.resultDetails.marks5QuestionCount = temp.marks5QuestionCount;
          this.resultDetails.name = temp.name;
          this.data.currentPageIndex++;
          this.currentCount = this.data.entityList.length;
          this.data.isNextPage =
            this.currentCount < this.resultDetails.allQuestionCount;
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (error) => {
        this.snackbarService.error(error);
      },
    });
  }

  initializeEmptyResponse() {
    this.data = {
      currentPageIndex: 0,
      entityList: [],
      pageSize: PaginationDefaultValues.DefaultPageSize,
      isNextPage: true,
    };
    this.resultDetails = {
      allCorrectQuestionCount: 0,
      allQuestionCount: 0,
      marks1CorrectQuestionCount: 0,
      marks1QuestionCount: 0,
      marks2CorrectQuestionCount: 0,
      marks2QuestionCount: 0,
      marks3CorrectQuestionCount: 0,
      marks3QuestionCount: 0,
      marks4CorrectQuestionCount: 0,
      marks4QuestionCount: 0,
      marks5CorrectQuestionCount: 0,
      marks5QuestionCount: 0,
      name: '',
      userId: 0,
      paginatedData: this.data,
    };
  }

  scrollListener = () => {
    const percent =
      (window.innerHeight + window.scrollY) / document.body.offsetHeight;
    this.scrollSubject.next(percent);
  };

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.scrollSubject.unsubscribe();
    window.removeEventListener('scroll', this.scrollListener);
  }
}
