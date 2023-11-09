import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import {
  CandidateModel,
  DropdownItem,
} from '../interfaces/candidate.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private http: HttpClient) {}

  getCandidate(
    currentPageIndex: number,
    pageSize: number,
    searchQuery: string,
    collegeId: number | null,
    groupId: number | null,
    status: boolean | null,
    year: number | null,
    sortField: string,
    sortOrder: string
  ): Observable<CandidateModel[]> {
    let params = new HttpParams()
      .set('currentPageIndex', currentPageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchQuery !== undefined) {
      params = params.set('searchQuery', searchQuery);
    }

    if (collegeId !== undefined && collegeId != null) {
      params = params.set('CollegeId', collegeId.toString());
    }

    if (status != null) {
      params = params.set('Status', status.toString());
    }

    if (groupId !== undefined && groupId != null) {
      params = params.set('GroupId', groupId.toString());
    }

    if (year !== undefined && year != null) {
      params = params.set('Year', year.toString());
    }

    params = params.set('SortField', sortField);
    params = params.set('SortOrder', sortOrder);

    return this.http
      .get<ResponseModel<string>>(
        `${environment.baseURL}User/${currentPageIndex}/${pageSize}`,
        { params }
      )
      .pipe(map((response: any) => response.data));
  }

  addCandidate(element: CandidateModel): Observable<ResponseModel<string>> {
    return this.http
      .post<ResponseModel<string>>(`${environment.baseURL}User/Create`, element)
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  importCandidate(data: any): Observable<ResponseModel<string>> {
    return this.http
      .post<ResponseModel<string>>(
        `${environment.baseURL}User/ImportUsers`,
        data
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  deleteCandidate(userIds: number[]): Observable<ResponseModel<string>> {
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }
    const payload = userIds;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}User/DeleteUsers`,
        payload,
        { headers }
      )
      .pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  updateStatus(id: number[], status: boolean) {
    if (!Array.isArray(id)) {
      id = [id];
    }
    const payload = {
      userIds: id,
      status: status,
    };
    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}User/ActiveInActiveUsers`,
        payload
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  getCollegesForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Colleges/GetActiveColleges`)
      .pipe(map((response: any) => response.data));
  }

  getGroupsForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Groups/GetGroupsForDropDown`)
      .pipe(map((response: any) => response.data));
  }
}
