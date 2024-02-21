import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { CandidateTestService } from '../../services/candidate-test.service';

@Component({
  selector: 'app-test-submitted',
  templateUrl: './test-submitted.component.html',
  styleUrls: ['./test-submitted.component.scss'],
})
export class TestSubmittedComponent implements OnInit {
  userId: number;
  testFinished: boolean;
  messageToShow: string;
  seconds = 10;
  message = `You will be automatically logged out within ${this.seconds} seconds.`;
  testStatus: 'End';
  constructor(
    private loginService: LoginService,
    private candidateTestService: CandidateTestService
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
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
          this.messageToShow = res.data;
        },
      });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F12' || event.keyCode === 123) {
      event.preventDefault();
    }
  }

  preventRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
  logout() {
    this.loginService.logout();
  }
}
