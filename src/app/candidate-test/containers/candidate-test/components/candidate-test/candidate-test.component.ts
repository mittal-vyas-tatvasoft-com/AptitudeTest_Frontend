import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject, Subscription } from 'rxjs';
import { QuestionStatusModel } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { SettingService } from 'src/app/modules/setting/services/setting.service';
import { StatusCode } from 'src/app/shared/common/enums';
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
  IsScreenCaptureEnabled = false;
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
  constructor(
    public loginService: LoginService,
    private router: Router,
    private testService: CandidateTestService,
    private snackBarService: SnackbarService,
    private settingService: SettingService
  ) {}

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.userId = candidateDetails.Id;
    this.getQuestionsStatus();
    this.settingService.get().subscribe({
      next: (data) => {
        this.IsScreenCaptureEnabled = data.data.screenCapture;
        this.IsFaceCaptureEnabled = data.data.camera;
        this.captureInterval = data.data.intervalForScreenCapture;
        if (data.data.screenCapture || data.data.camera) {
          this.checkPermissions();
        }
      },
    });
  }

  public sendImageToBackend(): void {
    this.formData.append('userId', this.userId.toString());
    if (this.IsScreenCaptureEnabled) {
      html2canvas(this.targetElement).then((canvas) => {
        // `canvas` now contains the screenshot
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        this.capturedImages.push(imageDataUrl);
        const screenShotData = imageDataUrl.split(',')[1];
        const blobScreenShot = this.dataURItoBlob(screenShotData);
        this.formData.append('screenShot', blobScreenShot, 'xyz.jpg');
        // Add the captured image URL to the array
        this.capturedImages.push(imageDataUrl);
      });
    }
    setTimeout(() => {
      if (this.webcamImage) {
        if (this.IsFaceCaptureEnabled) {
          const imageData = this.webcamImage.split(',')[1];
          const blobCamera = this.dataURItoBlob(imageData);
          this.formData.append('file', blobCamera, 'xyz.jpg');
        }
        this.CaptureImageSub = this.testService
          .CaptureImage(this.formData)
          .subscribe(() => {
            setTimeout(() => {
              this.formData = new FormData();
            }, 1000);
          });
      }
    }, 1000);
  }

  checkPermissions() {
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
        if (this.IsScreenCaptureEnabled === true) {
          this.router.navigate(['/user/instructions']);
        }
        if (err?.message === 'Permission denied') {
          this.status =
            'Camera Permission denied, please try again by approving camera access';
          this.snackBarService.error(this.status);
        } else {
          this.status = 'You may not have a camera system. Please try again...';
          this.snackBarService.error(this.status);
        }
      });
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
      this.testService.getQuestionsStatus(this.userId).subscribe({
        next: (response: ResponseModel<QuestionStatusModel>) => {
          if (response.statusCode === StatusCode.Success) {
            this.questionsStatus = response.data;
            this.seconds = this.questionsStatus.timeLeft * 60;
          } else {
            this.snackBarService.error(response.message);
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.CaptureImageSub.unsubscribe();
    clearInterval(this.intervalCameraCapture);
  }
}
