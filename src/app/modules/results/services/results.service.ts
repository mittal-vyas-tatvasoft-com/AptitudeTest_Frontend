import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DropdownItem } from '../../candidate/interfaces/candidate.interface';
import { environment } from 'src/environments/environment';
import {
  GetResultsParams,
  ResultDetails,
  ResultDetailsParam,
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

  getResultsDetails(param: ResultDetailsParam) {
    return this.http.get<ResponseModel<ResultDetails>>(
      `${environment.baseURL}Results/Get/${param.id}/${param.testId}/${param.marks}/${param.pagesize}/${param.pageIndex}`
    );
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
