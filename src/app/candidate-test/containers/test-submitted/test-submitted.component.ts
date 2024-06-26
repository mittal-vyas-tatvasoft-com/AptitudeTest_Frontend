import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { CandidateTestService } from '../../services/candidate-test.service';

@Component({
  selector: 'app-test-submitted',
  templateUrl: './test-submitted.component.html',
  styleUrls: ['./test-submitted.component.scss'],
})
export class TestSubmittedComponent implements OnInit, OnDestroy {
  userId: number;
  testFinished: boolean;
  messageToShow: string;
  seconds = 10;
  timeOut: any;
  message = `You will be automatically logged out within ${this.seconds} seconds.`;
  testStatus: 'End';
  constructor(
    private loginService: LoginService,
    private candidateTestService: CandidateTestService
  ) {}

  ngOnInit(): void {
    this.loginService.setSubmitted('true');
    this.timeOut = setTimeout(() => {
      this.logout();
    }, 10000);
    setInterval(() => {
      this.seconds = this.seconds - 1;
      this.message = `You will be automatically logged out within ${this.seconds} seconds.`;
    }, 1000);
    const candidateDetails = this.loginService.decodeToken();
    this.userId = +candidateDetails.Id;
    this.candidateTestService
      .getInstructionsOfTheTestForUser(this.userId, this.testStatus)
      .subscribe({
        next: (res: any) => {
          if (res.StatusCode == StatusCode.Success) {
            this.messageToShow = res.data;
          } else {
            this.messageToShow = res.message;
          }
        },
      });
  }

  logout() {
    this.loginService.logout();
  }
  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }
}
