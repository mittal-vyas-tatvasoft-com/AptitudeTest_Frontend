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
  testStatus = 'Start';
  testName: string;
  startTime: string;
  testDate: string;
  testDurationInMinutes: number;
  basicPoints: number;
  negativeMarkingPoints: number;
  testExists = false;
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
    this.getBasicTestDetails();
  }

  readyForTest() {
    this.candidateTestService
      .getInstructionsOfTheTestForUser(this.userId, this.testStatus)
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

  getBasicTestDetails() {
    this.candidateTestService
      .getInstructionsOfTheTestForUser(this.userId, this.testStatus)
      .subscribe({
        next: (test) => {
          if (test.data != null) {
            this.testExists = true;
            this.testName = test.data.testName;
            this.basicPoints = test.data.basicPoints;
            this.testDate = this.getTestStartDate(test.data.testDate);
            this.startTime = this.getTestStartTime(test.data.startTime);
            this.testDurationInMinutes = test.data.testDurationInMinutes;
            this.negativeMarkingPoints = test.data.negativeMarkingPoints;
          }
        },
      });
  }

  addPad(digit: number) {
    return digit > 9 ? digit : `0${digit}`;
  }

  getTestStartDate(date: string) {
    const testDate = new Date(date);
    const year = testDate.getFullYear();
    const month = testDate.getMonth() + 1;
    const day = testDate.getDate();
    const formattedTestDate = `${day}/${month}/${year}`;
    return formattedTestDate;
  }
  getTestStartTime(date: string) {
    const testDate = new Date(date);
    const hours = testDate.getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const minutes = testDate.getMinutes();
    const formattedTestTime = `${this.addPad(hours)}:${this.addPad(
      minutes
    )}  ${amPm}`;
    return formattedTestTime;
  }
}
