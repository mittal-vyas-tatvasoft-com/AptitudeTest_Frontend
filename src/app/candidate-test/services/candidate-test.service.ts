import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Question } from '../interfaces/candidate-test.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CandidateTestService {
  questionStatus = new Subject<number[]>();

  constructor(private http: HttpClient) {}

  getQuestion(questionId: number, userId: number, testId: number) {
    return this.http.get<ResponseModel<Question>>(
      `${environment.baseURL}CandidateTest/GetCandidateTestQuestion/${questionId}/${userId}/${testId}`
    );
  }
}
