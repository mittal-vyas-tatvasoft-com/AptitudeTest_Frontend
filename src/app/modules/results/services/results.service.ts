import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DropdownItem } from '../../candidate/interfaces/candidate.interface';
import { environment } from 'src/environments/environment';
import {
  ResultData,
  ResultDetails,
  ResultDetailsParam,
  ResultQueryParam,
  StatisticsModel,
} from '../interfaces/result.interface';
import * as XLSX from 'xlsx';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor(private http: HttpClient) {}

  getTestsForDropDown(): Observable<DropdownItem[]> {
    return this.http
      .get<DropdownItem[]>(`${environment.baseURL}Groups/GetGroupsForDropDown`)
      .pipe(map((response: any) => response.data));
  }

  getResults(
    data: ResultQueryParam,
    currentPageIndex: number,
    pageSize: number
  ) {
    let httpParam = this.createHttpParam(data, true);
    return this.http.get<ResponseModel<ResultData[]>>(
      `${environment.baseURL}Results/${currentPageIndex}/${pageSize}`,
      { params: httpParam }
    );
  }

  getResultsDetails(param: ResultDetailsParam) {
    return this.http.get<ResponseModel<ResultDetails>>(
      `${environment.baseURL}Results/Get/${param.id}/${param.testId}/${param.marks}/${param.pagesize}/${param.pageIndex}`
    );
  }

  getStatistics(data: ResultQueryParam) {
    let httpParam = this.createHttpParam(data, false);
    return this.http.get<ResponseModel<StatisticsModel[]>>(
      `${environment.baseURL}Results/0`,
      { params: httpParam }
    );
  }

  createHttpParam(data: ResultQueryParam, includeSort: boolean): HttpParams {
    let httpParam = new HttpParams();
    if (
      data.searchQuery !== undefined &&
      data.searchQuery !== null &&
      data.searchQuery !== ''
    ) {
      httpParam = httpParam.set('searchQuery', data.searchQuery);
    }
    if (
      data.collegeId !== undefined &&
      data.collegeId != null &&
      data.collegeId !== 0
    ) {
      httpParam = httpParam.set('CollegeId', data.collegeId.toString());
    }
    if (
      data.groupId !== undefined &&
      data.groupId !== null &&
      data.groupId !== 0
    ) {
      httpParam = httpParam.set('GroupId', data.groupId.toString());
    }
    if (
      data.testId !== undefined &&
      data.testId !== null &&
      data.testId !== 0
    ) {
      httpParam = httpParam.set('TestId', data.testId.toString());
    }
    if (includeSort) {
      if (data.sortOrder !== undefined && data.sortOrder !== '') {
        httpParam = httpParam.set('sortOrder', data.sortOrder.toString());
      }
      if (data.sortField !== undefined && data.sortField !== '') {
        httpParam = httpParam.set('sortField', data.sortField.toString());
      }
    }
    return httpParam;
  }
  downloadExcel(data: any) {
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
    this.saveAsExcelFile(excelBuffer, 'your_excel_filename');
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
}
