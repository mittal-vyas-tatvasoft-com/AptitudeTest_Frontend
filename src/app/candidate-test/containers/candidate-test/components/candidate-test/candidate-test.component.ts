import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import {
  QuestionStatusModel,
  UpdateUserTestStatusModel,
} from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { RefreshKey } from 'src/app/candidate-test/static/candidate-test.static';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { SettingService } from 'src/app/modules/setting/services/setting.service';
import { QuestionStatus, StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-candidate-test',
  templateUrl: './candidate-test.component.html',
  styleUrls: ['./candidate-test.component.scss'],
})
export class CandidateTestComponent implements OnInit, OnDestroy {
  userId: number;
  status: string;
  intervalCameraCapture: any;
  capturedImages: string[] = [];
  webcamImage: string;
  trigger: Subject<void> = new Subject();
  formData = new FormData();
  targetElement = document.documentElement;
  private ngUnsubscribe$ = new Subject<void>();
  IsScreenCaptureEnabled = false;
  ShowCam = true;
  IsFaceCaptureEnabled = false;
  captureInterval = 0;
  CaptureImageSub: Subscription;
  questionsStatus: QuestionStatusModel = {
    answered: 0,
    questionStatusVMs: [],
    totalQuestion: 0,
    unAnswered: 0,
    timeLeft: 0,
    isQuestionsMenu: false,
  };
  seconds: number;
  questionStatus = QuestionStatus;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private testService: CandidateTestService,
    private snackBarService: SnackbarService,
    private settingService: SettingService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.testService
      .updateUserTestStatus({
        isActive: false,
        userId: this.userId,
      })
      .subscribe();
  }

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.loginService.checkTestSubmitted();
    this.loginService.checkProfileNotSaved();
    const candidateDetails = this.loginService.decodeToken();
    this.userId = candidateDetails.Id;
    this.testService
      .updateUserTestStatus({
        isActive: true,
        userId: this.userId,
      })
      .subscribe();
    this.getQuestionsStatus();
    this.settingService.get().subscribe({
      next: (data) => {
        this.IsScreenCaptureEnabled = data.data.screenCapture;
        this.IsFaceCaptureEnabled = data.data.camera;
        this.captureInterval = data.data.intervalForScreenCapture;
        if (data.data.camera || data.data.screenCapture) {
          this.checkPermissions();
        }
        if (data.data.screenCapture) {
          this.getScreenAccess();
        }
      },
    });
  }

  public async sendImageToBackend(): Promise<void> {
    this.formData.append('userId', this.userId.toString());
    if (this.IsScreenCaptureEnabled) {
      if (this.testService.screenStream) {
        const blobScreenShot = await this.testService.captureScreen();
        const url = URL.createObjectURL(blobScreenShot);
        this.formData.append('screenShot', blobScreenShot, 'xyz.jpg');
        this.capturedImages.push(url);
      }
    }

    if (this.IsFaceCaptureEnabled) {
      if (this.webcamImage) {
        if (this.IsFaceCaptureEnabled) {
          const imageData = this.webcamImage.split(',')[1];
          const blobCamera = this.dataURItoBlob(imageData);
          this.formData.append('file', blobCamera, 'xyz.jpg');
        }
      }
    }
    setTimeout(() => {
      this.CaptureImageSub = this.testService
        .CaptureImage(this.formData)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          setTimeout(() => {
            this.formData = new FormData();
          }, 1000);
        });
    }, 1000);
  }

  checkPermissions() {
    if (this.IsFaceCaptureEnabled) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 500,
            height: 500,
            frameRate: 0,
            facingMode: 'user',
          },
        })
        .then(() => {
          this.status = 'My camera is accessing';
          setTimeout(() => {
            this.intervalCameraCapture = setInterval(() => {
              this.trigger.next();
              this.sendImageToBackend();
            }, this.captureInterval * 60 * 1000);
          }, 5000);
        })
        .catch((err) => {
          if (this.IsFaceCaptureEnabled === true) {
            this.router.navigate(['/user/instructions']);
            if (err?.message === 'Permission denied') {
              this.status =
                'Camera Permission denied, please try again by approving camera access';
              this.snackBarService.error(this.status);
            } else {
              this.status =
                'You may not have a camera system. Please try again...';
              this.snackBarService.error(this.status);
            }
          }
        });
    } else {
      setTimeout(() => {
        this.intervalCameraCapture = setInterval(() => {
          this.trigger.next();
          this.sendImageToBackend();
        }, this.captureInterval * 60 * 1000);
      }, 5000);
    }
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage.imageAsDataUrl;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  getQuestionsStatus() {
    if (this.userId) {
      let isRefresh: boolean = false;
      let localIsRefresh = localStorage.getItem(RefreshKey);
      if (
        localIsRefresh != '' &&
        localIsRefresh != undefined &&
        localIsRefresh != null
      ) {
        isRefresh = localIsRefresh === 'true';
      }
      this.testService.getQuestionsStatus(this.userId, isRefresh).subscribe({
        next: (response: ResponseModel<QuestionStatusModel>) => {
          localStorage.setItem(RefreshKey, 'false');
          if (response.statusCode === StatusCode.Success) {
            this.questionsStatus = response.data;
            if (this.questionsStatus.questionStatusVMs.length > 0) {
              if (this.isResume() && !this.questionsStatus.isQuestionsMenu) {
                const currentQuestion =
                  this.questionsStatus.questionStatusVMs.find(
                    (x) => x.status === this.questionStatus.Unvisited
                  );
                this.testService.loadQuestion.next(
                  currentQuestion?.questionId!
                );
                this.questionsStatus.questionStatusVMs =
                  this.questionsStatus.questionStatusVMs.map((q) => {
                    if (q.questionId == currentQuestion?.questionId) {
                      q.status = this.questionStatus.Current;
                    }
                    return q;
                  });
              } else {
                this.questionsStatus.questionStatusVMs[0].status =
                  this.questionStatus.Current;
                //Here We are passing -1 to load initial question
                this.testService.loadQuestion.next(-1);
              }
            }

            this.seconds = this.questionsStatus.timeLeft;
          } else {
            this.snackBarService.error(response.message);
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.testService.removeScreenCapture();
    clearInterval(this.intervalCameraCapture);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  showHideCam() {
    if (this.ShowCam === true) {
      this.ShowCam = false;
    } else {
      this.ShowCam = true;
    }
  }

  isResume(): boolean {
    return (
      this.questionsStatus.questionStatusVMs.filter(
        (x) => x.status == this.questionStatus.Unvisited
      ).length != this.questionsStatus.questionStatusVMs.length
    );
  }

  getScreenAccess() {
    this.testService.getScreenStream();
  }
}
