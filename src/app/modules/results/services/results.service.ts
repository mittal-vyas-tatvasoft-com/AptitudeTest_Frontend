import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DropdownItem } from '../../candidate/interfaces/candidate.interface';
import { environment } from 'src/environments/environment';
import {
  ResultData,
  ResultDetails,
  ResultDetailsParam,
  ResultExportData,
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
      .get<DropdownItem[]>(`${environment.baseURL}Common/GetTestForDropdown`)
      .pipe(map((response: any) => response.data));
  }

  getResults(
    data: ResultQueryParam,
    currentPageIndex: number,
    pageSize: number
  ) {
    let httpParam = this.createHttpParam(data, true);
    httpParam = httpParam.set('currentPageIndex', currentPageIndex.toString());
    httpParam = httpParam.set('pageSize', pageSize.toString());
    return this.http.get<ResponseModel<ResultData[]>>(
      `${environment.baseURL}Results/GetResults`,
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
      `${environment.baseURL}Results/GetResultStatistics`,
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
    this.saveAsExcelFile(excelBuffer, 'AptitudeTest-Results');
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

  getExportData(
    data: ResultQueryParam,
    currentPageIndex: number,
    pageSize: number
  ) {
    let httpParam = this.createHttpParam(data, false);
    httpParam = httpParam.set('currentPageIndex', currentPageIndex.toString());
    httpParam = httpParam.set('pageSize', pageSize.toString());
    return this.http.get<ResponseModel<ResultExportData[]>>(
      `${environment.baseURL}Results/GetResultExportData`,
      { params: httpParam }
    );
  }

  mapExportData(data: ResultExportData[]) {
    return data.map((record) => {
      return {
        'Full Name': record.fullName,
        'User Name': record.userName,
        Gender: record.gender,
        'Preferred Profile': record.preferedProfile,
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
        'Degree 2': record.degree2,
        'Degree 2 University': record.degree2University,
        'Degree 2 Stream': record.degree2Stream,
        'Degree 2 Grade': record.degree2Grade,
        'Degree 3': record.degree3,
        'Degree 3 University': record.degree3University,
        'Degree 3 Stream': record.degree3Stream,
        'Degree 3 Grade': record.degree3Grade,
        'Father Qualification': record.fatherQualification,
        'Father Occupation': record.fatherOccupation,
        'Mother Qualification': record.motherQualification,
        'Brother/Sister 1 Qualification': record.brother_Sister1Qualification,
        'Mother Occupation': record.motherOccupation,
        'Brother/Sister 2 Qualification':
          record.brother_Sister2Qualificatiostring,
        'Brother/Sister 1 Occupation': record.brother_Sister1Occupation,
        'Overall Score': record.overallScore,
        'Brother/Sister 2 Occupation': record.brother_Sister2Occupation,
        'Negative Marks': record.negativeMarks,
        'Positive Marks': record.positiveMarks,
        'Total Correct': record.totalCorrect,
        'Total Wrong': record.totalWrong,
        'Total Unanswered': record.totalUnanswered,
        'Maths Total Wrong': record.mathsTotalWrong,
        'Maths Total Correct': record.mathsTotalCorrect,
        'Maths Total Unanswered': record.mathsTotalUnanswered,
        'Maths 1 Mark Correct': record.mathsCorrectMarks1,
        'Maths 2 Marks Correct': record.mathsCorrectMarks2,
        'Maths 3 Marks Correct': record.mathsCorrectMarks3,
        'Maths 4 Marks Correct': record.mathsCorrectMarks4,
        'Maths 5 Marks Correct': record.mathsCorrectMarks5,
        'Reasoning Total Correct': record.reasoningTotalCorrect,
        'Reasoning Total Wrong': record.reasoningTotalWrong,
        'Reasoning Total Unanswered': record.reasoningTotalUnanswered,
        'Reasoning 1 Mark Correct': record.reasoningCorrectMarks1,
        'Reasoning 2 Marks Correct': record.reasoningCorrectMarks2,
        'Reasoning 3 Marks Correct': record.reasoningCorrectMarks3,
        'Reasoning 4 Marks Correct': record.reasoningCorrectMarks4,
        'Reasoning 5 Marks Correct': record.reasoningCorrectMarks5,
        'Technical Total Correct': record.technicalTotalCorrect,
        'Technical Total Wrong': record.technicalTotalWrong,
        'Technical Total Unanswered': record.technicalTotalUnanswered,
        'Technical 1 Mark Correct': record.technicalCorrectMarks1,
        'Technical 2 Marks Correct': record.technicalCorrectMarks2,
        'Technical 3 Marks Correct': record.technicalCorrectMarks3,
        'Technical 4 Marks Correct': record.technicalCorrectMarks4,
        'Technical 5 Marks Correct': record.technicalCorrectMarks5,
      };
    });
  }
}
