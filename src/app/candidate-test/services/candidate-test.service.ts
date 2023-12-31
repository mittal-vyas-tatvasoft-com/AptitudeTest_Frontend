import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import {
  Question,
  QuestionStatusModel,
  SaveAnswerModel,
  TestInstructions,
} from '../interfaces/candidate-test.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateTestService {
  questionStatus = new Subject<number[]>();
  loadQuestion = new BehaviorSubject<number>(-1);
  endTime = new Subject<string>();

  constructor(private http: HttpClient) {}

  getQuestion(questionId: number, userId: number) {
    return this.http.get<ResponseModel<Question>>(
      `${environment.baseURL}Candidates/GetCandidateTestQuestion/${questionId}/${userId}`
    );
  }

  getQuestionsStatus(userId: number) {
    return this.http.get<ResponseModel<QuestionStatusModel>>(
      `${environment.baseURL}Candidates/GetQuestionsStatus/${userId}`
    );
  }

  getInstructionsOfTheTestForUser(userId: number, testStatus: string) {
    return this.http.get<ResponseModel<TestInstructions>>(
      `${environment.baseURL}Candidates/GetInstructionsOfTheTestForUser/${userId}/${testStatus}`
    );
  }

  StartUserTest(userId: number) {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}Candidates/StartUserTest/${userId}`,
      userId
    );
  }

  saveAnswer(data: SaveAnswerModel) {
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Candidates/SaveTestQuestionAnswer`,
      data
    );
  }

  endTest(userId: number) {
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Candidates/EndTest/${userId}`,
      { userId }
    );
  }

  CaptureImage(data: FormData) {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}ScreenCapture/CameraCapture`,
      data
    );
  }
}
