import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
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
  messageToShow: string;
  userId: number;
  constructor(
    public loginService: LoginService,
    public candidateTestService: CandidateTestService,
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
            this.testExist = true;
            this.messageToShow = res.data.messaageAtStartOfTheTest;
          } else {
            this.snackbarService.error(NoTestAssigned);
            this.router.navigate(['/user']);
            this.testExist = false;
          }
        },
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
