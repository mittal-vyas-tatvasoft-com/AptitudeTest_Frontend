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

  getTests(
    currentPageIndex: number,
    pageSize: number,
    searchQuery: string | null,
    groupId: number | null,
    status: number | null,
    date: Date | null,
    sortField: string | null,
    sortOrder: string | null
  ) {
    const params: any = {
      currentPageIndex,
      pageSize,
    };

    if (searchQuery != '') {
      params.searchQuery = searchQuery;
    }
    if (status != null) {
      params.Status = status;
    }
    if (groupId != null) {
      params.GroupId = groupId;
    }
    if (date != null) {
      params.Date = moment(date).format('MM-DD-YYYY');
    }
    if (sortField != '') {
      params.sortField = sortField;
    }
    if (sortOrder != '') {
      params.sortOrder = sortOrder;
    }
    return this.http.get(
      `${environment.baseURL}Tests/${currentPageIndex}/${pageSize}`,
      {
        params,
      }
    );
  }
}
