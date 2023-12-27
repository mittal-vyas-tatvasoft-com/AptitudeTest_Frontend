import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import {
  Question,
  QuestionsCount,
} from 'src/app/modules/questions/interfaces/question.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import {
  BulkStatusUpdate,
  UpdateStatus,
} from 'src/app/shared/common/interfaces/update-status';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private httpClient: HttpClient) {}

  questions(
    pageSize: number,
    pageIndex: number,
    topic?: number,
    status?: boolean
  ) {
    let parameter = new HttpParams();
    parameter = parameter.set('pageSize', pageSize);
    parameter = parameter.set('pageIndex', pageIndex);
    if (typeof topic != 'undefined') {
      parameter = parameter.set('topic', topic);
    }
    if (typeof status != 'undefined') {
      parameter = parameter.set('status', status);
    }
    return this.httpClient.get<ResponseModel<Pagination<Question>>>(
      `${environment.baseURL}Questions`,
      {
        params: parameter,
      }
    );
  }

  get(id: number) {
    return this.httpClient.get<ResponseModel<Question>>(
      `${environment.baseURL}Questions/Get/${id}`
    );
  }

  getQuestionCount(topic?: number, status?: boolean) {
    const url =
      `${environment.baseURL}Questions/GetQuestionCount` +
      this.createUrl(topic, status);
    return this.httpClient.get<ResponseModel<QuestionsCount>>(url);
  }

  updateStatus(status: UpdateStatus) {
    return this.httpClient.put<ResponseModel<number>>(
      `${environment.baseURL}Questions/UpdateStatus`,
      status
    );
  }

  delete(id: number) {
    return this.httpClient.delete<ResponseModel<null>>(
      `${environment.baseURL}Questions/Delete?id=${id}`
    );
  }

  create(questionFormData: FormData) {
    return this.httpClient.post<ResponseModel<null>>(
      `${environment.baseURL}Questions/Create`,
      questionFormData
    );
  }

  update(questionFormData: FormData) {
    return this.httpClient.put<ResponseModel<null>>(
      `${environment.baseURL}Questions/Update`,
      questionFormData
    );
  }

  importQuestions(questionData: FormData) {
    return this.httpClient.post<ResponseModel<number>>(
      `${environment.baseURL}Questions/ImportQuestions`,
      questionData
    );
  }

  createUrl(topic?: number, status?: boolean) {
    let url = '';
    if (typeof topic != 'undefined' && typeof status != 'undefined') {
      url = url + `?topic=${topic}&status=${status}`;
    } else if (typeof topic != 'undefined') {
      url = url + `?topic=${topic}`;
    } else if (typeof status != 'undefined') {
      url = url + `?status=${status}`;
    }
    return url;
  }

  updateBulkStatus(bulkStatusUpdate: BulkStatusUpdate) {
    return this.httpClient.put<ResponseModel<string>>(
      `${environment.baseURL}Questions/UpdateBulkStatus`,
      bulkStatusUpdate
    );
  }
}
