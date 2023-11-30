import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { QuestionStatus, StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.scss'],
})
export class McqTestComponent implements OnInit {
  firstName: string;
  lastName: string;
  userId: number = 0;
  testId: number = 0;
  timeRemaining = {
    hours: 1,
    minutes: 20,
    seconds: 0,
  };
  seconds = 0;
  question: Question = {
    id: 0,
    questionText: '',
    options: [],
    optionType: 0,
    questionType: 0,
    difficulty: 0,
    nextQuestionId: -1,
    questionNumber: 0,
    totalQuestions: 0,
  };

  constructor(
    public loginService: LoginService,
    private router: Router,
    private testService: CandidateTestService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.firstName = candidateDetails.FirstName;
    this.lastName = candidateDetails.Name;
    this.userId = candidateDetails.Id;

    this.displayQuestion();

    this.seconds =
      this.timeRemaining.hours * 3600 +
      this.timeRemaining.minutes * 60 +
      this.timeRemaining.seconds;
    setInterval(() => {
      this.seconds = this.seconds - 1;
      let hours = Math.floor(this.seconds / 3600);
      let minutes = Math.floor((this.seconds % 3600) / 60);
      let seconds = this.seconds - minutes * 60 - hours * 3600;
      this.timeRemaining = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }, 1000);
  }

  displayQuestion() {
    if (this.question.nextQuestionId && this.userId && this.testId) {
      this.testService
        .getQuestion(this.question.nextQuestionId, this.userId, this.testId)
        .subscribe({
          next: (response: ResponseModel<Question>) => {
            if (response.statusCode == StatusCode.Success) {
              this.question = response.data;
            } else {
              this.snackBarService.error(response.message);
            }
          },
        });
    }
  }

  onSubmit(event: boolean[]) {
    this.displayQuestion();
    if (this.question.questionNumber == this.question.totalQuestions) {
      this.router.navigate(['/user/submitted']);
    }
    let state =
      event.filter(Boolean).length > 0
        ? QuestionStatus.Answered
        : QuestionStatus.Skipped;
    let status = [this.question.questionNumber, state];
    this.testService.questionStatus.next(status);
  }
}
