import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import {
  CandidateExportData,
  CandidateModel,
  DropdownItem,
  ExportCandidatesParams,
  GetAllCandidateParams,
} from '../interfaces/candidate.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private http: HttpClient) {}

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

    if (data.status != null) {
      params = params.set('Status', data.status.toString());
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

  importCandidate(data: FormData): Observable<ResponseModel<number>> {
    return this.http
      .post<ResponseModel<number>>(
        `${environment.baseURL}User/ImportUsers`,
        data
      )
      .pipe(
        map((res: ResponseModel<number>) => {
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
        catchError((error: Error) => {
          throw error;
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

  getCollegesForDropDown(isAdmin?: boolean): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(
        `${environment.baseURL}${
          isAdmin === false && isAdmin !== undefined ? `Common` : `Colleges`
        }/GetActiveColleges`
      )
      .pipe(map((response: any) => response.data));
  }

  getGroupsForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Groups/GetGroupsForDropDown`)
      .pipe(map((response: any) => response.data));
  }

  getProfilesForDropDown(isAdmin?: boolean): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(
        `${environment.baseURL}${
          isAdmin === false && isAdmin !== undefined ? `Common` : `Profiles`
        }/GetActiveProfiles`
      )
      .pipe(map((response: any) => response.data));
  }

  getDegreeForDropDown(isAdmin?: boolean): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(
        `${environment.baseURL}${
          isAdmin === false && isAdmin !== undefined ? `Common` : `Degrees`
        }/GetActiveDegrees`
      )
      .pipe(map((response: any) => response.data));
  }

  getStateForDropDown(isAdmin?: boolean): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(
        `${environment.baseURL}${
          isAdmin === false && isAdmin !== undefined ? `Common` : `User`
        }/GetAllState`
      )
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

  registerCandidate(candidateData: any): Observable<any> {
    const updateUrl = `${environment.baseURL}Common/Register`;
    return this.http.post(updateUrl, candidateData);
  }

  getExportData(data: ExportCandidatesParams) {
    let parameters = new HttpParams()
      .set('currentPageIndex', data.currentPageIndex.toString())
      .set('pageSize', data.pageSize.toString());

    if (data.searchQuery !== undefined) {
      parameters = parameters.set('searchQuery', data.searchQuery);
    }

    if (data.collegeId !== undefined && data.collegeId != null) {
      parameters = parameters.set('CollegeId', data.collegeId.toString());
    }

    if (data.groupId !== undefined && data.groupId != null) {
      parameters = parameters.set('GroupId', data.groupId.toString());
    }

    if (data.year !== undefined && data.year != null) {
      parameters = parameters.set('Year', data.year.toString());
    }

    parameters = parameters.set('SortField', data.sortField);
    parameters = parameters.set('SortOrder', data.sortOrder);
    return this.http.get<ResponseModel<CandidateExportData[]>>(
      `${environment.baseURL}User/GetUsersExportData`,
      { params: parameters }
    );
  }

  mapExportData(data: CandidateExportData[]) {
    return data.map((record) => {
      return {
        'Full Name': record.fullName,
        'User Name': record.userName,
        Gender: record.gender,
        College: record.abbreviationofCollege,
        'Preferred Location': record.location,
        'Preferred Profile': record.preferredProfile,
        'Applied Through': record.appliedThrough,
        'Permanent Address': record.permanentAddress,
        Mobile: record.mobile,
        Email: record.email,
        DOB: record.dateOfBirth_Age,
        'SSC School': record.sscUniversity,
        'SSC Stream': record.sscStream,
        'SSC Grade': record.sscGrade,
        'SSC Maths': record.sscMaths,
        'HSC School': record.hscUniversity,
        'HSC Stream': record.hscStream,
        'HSC Grade': record.hscGrade,
        'HSC Maths/Account Marks': record.hscMaths_Account,
        'HSC Physics/State Marks': record.hscPhysics_State,
        'Degree 1': record.degree1,
        'Degree 1 University': record.degree1University,
        'Degree 1 Stream': record.degree1Stream,
        'Degree 1 Grade': record.degree1Grade,
        'ACPC Merit rank': record.acpcMeritRank,
        'GUJCET Score': record.gujcetScore,
        'JEE Score': record.jeescore,
      };
    });
  }

  downloadExcel(data: any[]) {
    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook with a single sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Save the Excel file
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'AptitudeTest-Candidates');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  getStremForDropDown(isAdmin?: boolean): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(
        `${environment.baseURL}${
          isAdmin === false && isAdmin !== undefined ? `Common` : `Streams`
        }/GetAllActiveStreams`
      )
      .pipe(map((response: any) => response.data));
  }

  ChangeUserPasswordByAdmin(Email: string, Password: string) {
    const payload = { Email: Email, Password: Password };
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}User/ChangeUserPasswordByAdmin`,
      payload
    );
  }
}
