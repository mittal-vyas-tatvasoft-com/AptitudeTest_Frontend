import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import { Question } from 'src/app/shared/common/interfaces/question.interface';
import { UpdateStatus } from 'src/app/shared/common/interfaces/update-status';
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
    const parameter: any = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    if (typeof topic != 'undefined') {
      parameter.topic = topic;
    }
    if (typeof status != 'undefined') {
      parameter.status = status;
    }
    //let url = `${environment.baseURL}Questions` + this.createUrl(topic, status);
    return this.httpClient.get<Pagination<Question>>(
      `${environment.baseURL}Questions`,
      {
        params: parameter,
      }
    );
  }

  get(id: number) {
    return this.httpClient.get(`${environment.baseURL}Questions/Get?id=${id}`);
  }

  getQuestionCount(topic?: number, status?: boolean) {
    let url =
      `${environment.baseURL}Questions/GetQuestionCount` +
      this.createUrl(topic, status);
    return this.httpClient.get(url);
  }

  updateStatus(status: UpdateStatus) {
    return this.httpClient.put(
      `${environment.baseURL}Questions/UpdateStatus`,
      status
    );
  }

  delete(id: number) {
    return this.httpClient.delete(
      `${environment.baseURL}Questions/Delete?id=${id}`
    );
  }

  create(question: any) {
    return this.httpClient.post(
      `${environment.baseURL}Questions/Create`,
      question
    );
  }

  update(question: any) {
    return this.httpClient.put(
      `${environment.baseURL}Questions/Update`,
      question
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
}
