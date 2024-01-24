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
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { Messages } from '../static/candidate-test.static';

@Injectable({
  providedIn: 'root',
})
export class CandidateTestService {
  questionStatus = new Subject<number[]>();
  loadQuestion = new BehaviorSubject<number>(-1);
  endTime = new Subject<string>();
  screenStream: MediaStream | null = null;
  videoTrack: MediaStreamTrack;
  constructor(
    private http: HttpClient,
    private snackbarServices: SnackbarService
  ) {}

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

  async getScreenStream(): Promise<MediaStream> {
    if (!this.screenStream) {
      const constraints: MediaStreamConstraints = {
        video: { mediaSource: 'screen' } as MediaTrackConstraints,
      };

      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia(
          constraints
        );
        this.videoTrack = this.screenStream.getVideoTracks()[0];
        this.videoTrack.addEventListener('ended', this.screenEventListener);
        const mediaSource = (this.videoTrack.getSettings() as any)
          .displaySurface;
        if (mediaSource !== 'monitor') {
          this.snackbarServices.error(Messages.ScreenCaptureError);
          this.stop();
          return this.getScreenStream();
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          this.snackbarServices.error(Messages.ScreenCaptureError);
          this.stop();
          this.getScreenStream();
        }
        throw error;
      }
    }
    return this.screenStream;
  }

  async captureScreen(): Promise<Blob> {
    try {
      const screenStream = await this.getScreenStream();
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.srcObject = screenStream;
        video.onloadedmetadata = async () => {
          await video.play();
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(this.canvasToBlob(canvas));
        };
      });
    } catch (error) {
      throw error;
    }
  }

  private canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Error converting canvas to blob.');
        }
      });
    });
  }

  stop() {
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.screenStream = null;
  }

  screenEventListener = () => {
    this.snackbarServices.error(Messages.ScreenCaptureError);
    this.stop();
    this.getScreenStream();
  };

  removeScreenCapture() {
    this.videoTrack.removeEventListener('ended', this.screenEventListener);
    this.stop();
  }
}
