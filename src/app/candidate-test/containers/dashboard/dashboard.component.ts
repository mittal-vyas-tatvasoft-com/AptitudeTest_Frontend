import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { CandidateTestService } from '../../services/candidate-test.service';
import { NoTestAssigned } from '../../static/candidate-test.static';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  firstName: string;
  lastName: string;
  userId: number;
  constructor(
    public loginService: LoginService,
    private router: Router,
    public candidateTestService: CandidateTestService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.firstName = candidateDetails.FirstName;
    this.lastName = candidateDetails.Name;
    this.userId = +candidateDetails.Id;
  }

  readyForTest() {
    this.candidateTestService
      .getInstructionsAtStartOfTheTestForUser(this.userId)
      .subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.router.navigate(['/user/instructions']);
          } else {
            this.snackbarService.error(NoTestAssigned);
          }
        },
      });
  }
}
