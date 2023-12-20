import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { SettingService } from 'src/app/modules/setting/services/setting.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { CandidateTestService } from '../../services/candidate-test.service';
import { NoTestAssigned } from '../../static/candidate-test.static';

@Component({
  selector: 'app-candidate-instructions',
  templateUrl: './candidate-instructions.component.html',
  styleUrls: ['./candidate-instructions.component.scss'],
})
export class CandidateInstructionsComponent implements OnInit {
  isChecked = false;
  testExist = false;
  NoCameraAccess = false;
  messageToShow: string;
  IsFaceCaptureEnabled = false;
  status: string;
  testStatus = 'Start';
  userId: number;
  constructor(
    public loginService: LoginService,
    public candidateTestService: CandidateTestService,
    private snackbarService: SnackbarService,
    private router: Router,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.userId = +candidateDetails.Id;
    this.candidateTestService
      .getInstructionsOfTheTestForUser(this.userId, this.testStatus)
      .subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.testExist = true;
            this.messageToShow = res.data.messageAtStartOfTheTest;
            this.candidateTestService.endTime.next(res.data.endTime);
          } else {
            this.snackbarService.error(NoTestAssigned);
            this.router.navigate(['/user']);
            this.testExist = false;
          }
        },
      });

    this.settingService.get().subscribe({
      next: (data) => {
        this.IsFaceCaptureEnabled = data.data.camera;
        if (data.data.camera) {
          this.checkPermissions();
        }
      },
    });
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
        this.NoCameraAccess = false;
      })
      .catch((err) => {
        if (err) {
          this.settingService.get().subscribe({
            next: (res) => {
              if (res.data.screenCapture === true) {
                this.NoCameraAccess = true;
                if (err?.message === 'Permission denied') {
                  this.status =
                    'Camera Permission denied, please try again by approving the camera access';
                } else {
                  this.status =
                    'You may not have a camera system. Please try again...';
                }
              }
            },
          });
        }
      });
  }

  startTest() {
    this.candidateTestService.StartUserTest(this.userId).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.router.navigate(['/user/test']);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }
}
