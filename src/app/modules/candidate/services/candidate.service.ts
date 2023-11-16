import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import {
  CandidateModel,
  DropdownItem,
  GetAllCandidateParams,
} from '../interfaces/candidate.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private http: HttpClient) { }

  getCandidate(data: GetAllCandidateParams): Observable<CandidateModel[]> {
    let params = new HttpParams()
      .set('currentPageIndex', data.currentPageIndex.toString())
      .set('pageSize', data.pageSize.toString());

    if (data.searchQuery !== undefined) {
      params = params.set('searchQuery', data.searchQuery);
    }

    if (data.collegeId !== undefined && data.collegeId != null) {
      params = params.set('CollegeId', data.collegeId.toString());
    }

    if (status != null) {
      params = params.set('Status', status.toString());
    }

    if (data.groupId !== undefined && data.groupId != null) {
      params = params.set('GroupId', data.groupId.toString());
    }

    if (data.year !== undefined && data.year != null) {
      params = params.set('Year', data.year.toString());
    }

    params = params.set('SortField', data.sortField);
    params = params.set('SortOrder', data.sortOrder);

    return this.http
      .get<ResponseModel<string>>(
        `${environment.baseURL}User/${data.currentPageIndex}/${data.pageSize}`,
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

  getProfilesForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Profiles/GetActiveProfiles`)
      .pipe(map((response: any) => response.data));
  }

  getDegreeForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Degrees/GetActiveDegrees`)
      .pipe(map((response: any) => response.data));
  }

  getStateForDropDown(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(`${environment.baseURL}User/GetAllState`)
      .pipe(map((response: any) => response.data));
  }

  getCandidateData(Id: number): Observable<any> {
    const apiUrl = `${environment.baseURL}User/Get/${Id}`;
    return this.http.get(apiUrl);
  }

  updateCandidate(candidateData: any): Observable<any> {
    const updateUrl = `${environment.baseURL}User/Update`;
    return this.http.put(updateUrl, candidateData);
  }

  getStremForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Streams/GetAllActiveStreams`)
      .pipe(map((response: any) => response.data));
  }
}
