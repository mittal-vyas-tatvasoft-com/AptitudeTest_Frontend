import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { IDeleteDirPayload, ITestFile, ITestFolder } from '../interfaces/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {
  constructor(private httpClient: HttpClient) {}
  
  getTests() {
    const url = `${environment.baseURL}Reports/GetTests`
    return this.httpClient.get<ResponseModel<ITestFolder[]>>(url);
  }

  getUsers(testId: number) {
    const url = `${environment.baseURL}Reports/GetUsers/${testId}`
    return this.httpClient.get<ResponseModel<ITestFolder[]>>(url);
  }

  getUserDirs(testId: number, userId: number) {
    const url = `${environment.baseURL}Reports/GetUserDirectories/${userId}/${testId}`
    return this.httpClient.get<ResponseModel<ITestFolder[]>>(url);
  }

  getFiles(testId: number, userId: number, userDirId: number) {
    const url = `${environment.baseURL}Reports/GetScreenShots/${userId}/${testId}/${userDirId}`
    return this.httpClient.get<ResponseModel<ITestFile[]>>(url);
  }

  deleteDirectory(payload: IDeleteDirPayload) {
    const url = `${environment.baseURL}Reports/DeleteDirectory`;
    return this.httpClient.delete<ResponseModel<ITestFile[] | ITestFolder[]>>(url, {
      body: payload
    });
  }
}
