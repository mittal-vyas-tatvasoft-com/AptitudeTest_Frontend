import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../../candidate/interfaces/candidate.interface';
import {
  AddTestQuestionModel,
  AllInsertedQuestionModel,
  CreateTestModel,
  GetAllTestCandidateParams,
  QuestionTypeCount,
  TestCandidatesModel,
  TestData,
  TestQueryParams,
  TopicWiseQuestionData,
  UpdateTestStatus,
} from '../interfaces/test.interface';
import { QuestionCountInitial } from '../static/test.static';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  public questionCountSingleAnswer = new BehaviorSubject<QuestionTypeCount>(
    QuestionCountInitial
  );
  public questionCountMultiAnswer = new BehaviorSubject<QuestionTypeCount>(
    QuestionCountInitial
  );

  public singleMarksDropDownData = new Subject<any>();
  public multiMarksDropDownData = new Subject<any>();

  constructor(private http: HttpClient) {
    this.questionCountSingleAnswer.subscribe((res) => {
      const data = [
        {
          value: res.oneMarkQuestion,
          key: 'oneMarkQuestionSingleAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.twoMarkQuestion,
          key: 'twoMarkQuestionSingleAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.threeMarkQuestion,
          key: 'threeMarkQuestionSingleAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.fourMarkQuestion,
          key: 'fourMarkQuestionSingleAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.fiveMarkQuestion,
          key: 'fiveMarkQuestionSingleAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
      ];
      this.singleMarksDropDownData.next(data);
    });

    this.questionCountMultiAnswer.subscribe((res) => {
      const data = [
        {
          value: res.oneMarkQuestion,
          key: 'oneMarkQuestionMultiAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.twoMarkQuestion,
          key: 'twoMarkQuestionMultiAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.threeMarkQuestion,
          key: 'threeMarkQuestionMultiAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.fourMarkQuestion,
          key: 'fourMarkQuestionMultiAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
        {
          value: res.fiveMarkQuestion,
          key: 'fiveMarkQuestionMultiAnswer',
          label: 'Date',
          required: false,
          inputType: 'text',
          displayIcon: false,
        },
      ];
      this.multiMarksDropDownData.next(data);
    });
  }

  createTest(data: CreateTestModel): Observable<ResponseModel<number>> {
    return this.http
      .post<ResponseModel<number>>(
        `${environment.baseURL}Tests/CreateTest`,
        data
      )
      .pipe(
        map((res: ResponseModel<number>) => {
          return res;
        })
      );
  }

  updateTest(data: CreateTestModel) {
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}Tests/UpdateTest`,
        data
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  updateTestStatus(data: UpdateTestStatus) {
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}Tests/UpdateTestStatus`,
        data
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  getAllTestCandidates(data: GetAllTestCandidateParams) {
    let params = new HttpParams();
    if (data.searchQuery != '') {
      params = params.set('searchQuery', data.searchQuery);
    }
    params = params.set('collegeId', data.collegeId.toString());
    params = params.set('SortField', data.sortField);
    params = params.set('SortOrder', data.sortOrder);
    return this.http
      .get<ResponseModel<TestCandidatesModel[]>>(
        `${environment.baseURL}Tests/GetAllTestCandidates/${data.groupId}/${data.currentPageIndex}/${data.pageSize}`,
        { params }
      )
      .pipe(
        map((res: ResponseModel<TestCandidatesModel[]>) => {
          return res;
        })
      );
  }

  updateTestGroup(testId: number, groupId: number) {
    const params = {
      testId: testId,
      groupId: groupId,
      updatedBy: 1,
    };
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}Tests/UpdateTestGroup`,
        params
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  checkTestName(testName: string) {
    return this.http
      .get<ResponseModel<string>>(
        `${environment.baseURL}Tests/CheckTestName/${testName}`
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  delete(id: number) {
    return this.http.delete<ResponseModel<string>>(
      `${environment.baseURL}Tests/DeleteTest/${id}`
    );
  }

  deleteMultiple(testIds: number[]) {
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}Tests/DeleteMultiple`,
        testIds
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  getGroups(): Observable<ResponseModel<DropdownItem[]>> {
    return this.http.get<ResponseModel<DropdownItem[]>>(
      `${environment.baseURL}Groups/GetGroupsForDropDown`
    );
  }

  getTests(data: TestQueryParams) {
    let params = new HttpParams()
      .set('currentPageIndex', data.currentPageIndex.toString())
      .set('pageSize', data.pageSize.toString());

    if (data.searchQuery !== undefined && data.searchQuery != null) {
      params = params.set('searchQuery', data.searchQuery);
    }

    if (data.status != null) {
      params = params.set('Status', data.status.toString());
    }

    if (data.groupId !== undefined && data.groupId != null) {
      params = params.set('GroupId', data.groupId.toString());
    }

    if (data.date !== undefined && data.date != null) {
      params = params.set('Date', moment(data.date).format('MM-DD-YYYY'));
    }

    if (data.sortField != null) {
      params = params.set('SortField', data.sortField);
    }
    if (data.sortOrder != null) {
      params = params.set('SortOrder', data.sortOrder);
    }

    return this.http.get<ResponseModel<TestData[]>>(
      `${environment.baseURL}Tests/${data.currentPageIndex}/${data.pageSize}`,
      {
        params,
      }
    );
  }

  GetTopicWiseQuestionsCount() {
    return this.http
      .get<ResponseModel<TopicWiseQuestionData[]>>(
        `${environment.baseURL}Tests/GetTopicWiseQuestionsCount`
      )
      .pipe(
        map((res: ResponseModel<TopicWiseQuestionData[]>) => {
          return res;
        })
      );
  }

  GetAllInsertedQuestions(testId: number) {
    return this.http
      .get<ResponseModel<AllInsertedQuestionModel>>(
        `${environment.baseURL}Tests/GetQuestionsMarksCount/${testId}`
      )
      .pipe(
        map((res: ResponseModel<AllInsertedQuestionModel>) => {
          return res;
        })
      );
  }

  addTestQuestions(data: AddTestQuestionModel) {
    return this.http
      .post<ResponseModel<string>>(
        `${environment.baseURL}Tests/AddTestQuestions`,
        data
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  DeleteTopicWiseTestQuestions(testId: number, topicId: number) {
    return this.http
      .delete<ResponseModel<string>>(
        `${environment.baseURL}Tests/DeleteTopicWiseTestQuestions/${testId}/${topicId}`
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  DeleteAllTestQuestions(testId: number) {
    return this.http
      .delete<ResponseModel<string>>(
        `${environment.baseURL}Tests/DeleteAllTestQuestions/${testId}`
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  GetTestById(testId: number): any {
    return this.http.get(`${environment.baseURL}Tests/GetTestById/${testId}`);
  }

  UpdateTestQuestions(data: AddTestQuestionModel) {
    return this.http.put(
      `${environment.baseURL}Tests/UpdateTestQuestions`,
      data
    );
  }

  UpdateBasicPoints(testId: number) {
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Tests/UpdateBasicPoints/${testId}`,
      { testId }
    );
  }

  CheckSumAndSelectedQuestions(form: FormGroup) {
    const sum =
      form.get('oneMarkQuestionSingleAnswer')?.value +
      form.get('twoMarkQuestionSingleAnswer')?.value * 2 +
      form.get('threeMarkQuestionSingleAnswer')?.value * 3 +
      form.get('fourMarkQuestionSingleAnswer')?.value * 4 +
      form.get('fiveMarkQuestionSingleAnswer')?.value * 5 +
      form.get('oneMarkQuestionMultiAnswer')?.value +
      form.get('twoMarkQuestionMultiAnswer')?.value * 2 +
      form.get('threeMarkQuestionMultiAnswer')?.value * 3 +
      form.get('fourMarkQuestionMultiAnswer')?.value * 4 +
      form.get('fiveMarkQuestionMultiAnswer')?.value * 5;

    const totalQuestionsSelected =
      form.get('oneMarkQuestionSingleAnswer')?.value +
      form.get('twoMarkQuestionSingleAnswer')?.value +
      form.get('threeMarkQuestionSingleAnswer')?.value +
      form.get('fourMarkQuestionSingleAnswer')?.value +
      form.get('fiveMarkQuestionSingleAnswer')?.value +
      form.get('oneMarkQuestionMultiAnswer')?.value +
      form.get('twoMarkQuestionMultiAnswer')?.value +
      form.get('threeMarkQuestionMultiAnswer')?.value +
      form.get('fourMarkQuestionMultiAnswer')?.value +
      form.get('fiveMarkQuestionMultiAnswer')?.value;

    return { sum, totalQuestionsSelected };
  }
}
