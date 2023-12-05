import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { CandidateTestService } from '../../services/candidate-test.service';
import { NoTestAssigned } from '../../static/candidate-test.static';

@Component({
  selector: 'app-test-submitted',
  templateUrl: './test-submitted.component.html',
  styleUrls: ['./test-submitted.component.scss'],
})
export class TestSubmittedComponent implements OnInit {
  userId: number;
  testFinished: boolean;
  messageToShow: string;
  constructor(
    private loginService: LoginService,
    private candidateTestService: CandidateTestService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.userId = +candidateDetails.Id;
    this.candidateTestService
      .getInstructionsAtStartOfTheTestForUser(this.userId)
      .subscribe({
        next: (res: any) => {
          if (res.statusCode == StatusCode.Success) {
            this.messageToShow = res.data.messaageAtStartOfTheTest;
          } else {
            this.snackbarService.error(NoTestAssigned);
            this.router.navigate(['/user']);
          }
        },
      });
  }
}
