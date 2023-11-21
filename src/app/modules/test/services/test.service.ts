import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetAllTestCandidateParams,
  createTestModel,
  testCandidatesModel,
} from '../interfaces/test.interface';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

  createTest(data: createTestModel): Observable<ResponseModel<number>> {
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

  getAllTestCandidates(data: GetAllTestCandidateParams) {
    let params = new HttpParams();
    if (data.searchQuery != '') {
      params = params.set('searchQuery', data.searchQuery);
    }

    params = params.set('collegeId', data.collegeId.toString());

    params = params.set('SortField', data.sortField);
    params = params.set('SortOrder', data.sortOrder);

    return this.http
      .get<ResponseModel<testCandidatesModel[]>>(
        `${environment.baseURL}Tests/GetAllTestCandidates/${data.groupId}/${data.currentPageIndex}/${data.pageSize}`,
        { params }
      )
      .pipe(
        map((res: ResponseModel<testCandidatesModel[]>) => {
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
}
