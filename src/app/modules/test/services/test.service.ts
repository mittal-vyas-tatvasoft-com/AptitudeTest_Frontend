import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetAllTestCandidateParams,
  TestQueryParams,
  createTestModel,
  testCandidatesModel,
} from '../interfaces/test.interface';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Observable, map } from 'rxjs';
import { DropdownData } from 'src/app/shared/common/interfaces/dropdown-data.interface';
import * as moment from 'moment';

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

  delete(id: any) {
    return this.http.delete<ResponseModel<string>>(
      `${environment.baseURL}Tests/DeleteTest/${id}`
    );
  }

  getGroups(): Observable<ResponseModel<DropdownData[]>> {
    return this.http.get<ResponseModel<DropdownData[]>>(
      `${environment.baseURL}Groups/GetGroupsForDropDown`
    );
  }

  getTests(data: TestQueryParams) {
    //const params=testQueryParams;

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

    return this.http.get(
      `${environment.baseURL}Tests/${data.currentPageIndex}/${data.pageSize}`,
      {
        params,
      }
    );
  }
}
