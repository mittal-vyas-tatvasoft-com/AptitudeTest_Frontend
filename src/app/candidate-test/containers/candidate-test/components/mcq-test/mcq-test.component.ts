import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Answer,
  Question,
  SaveAnswerModel,
} from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { QuestionStatus, StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.scss'],
})
export class McqTestComponent implements OnInit, OnDestroy {
  firstName: string;
  lastName: string;
  userId: number;
  testStatus = 'Start';
  timeRemaining = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  endTime: string;
  timeRemainingToEndTime: number;
  @Input() seconds = 0;
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
    answers: [],
  };
  interval: any;
  constructor(
    public loginService: LoginService,
    private router: Router,
    private candidateTestService: CandidateTestService,
    private snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.firstName = candidateDetails.FirstName;
    this.lastName = candidateDetails.Name;
    this.userId = candidateDetails.Id;
    this.getEndTime();
    this.displayQuestion();
    this.interval = setInterval(() => {
      this.seconds = this.seconds - 1;
      let hours = Math.floor(this.seconds / 3600);
      let minutes = Math.floor((this.seconds % 3600) / 60);
      let seconds = this.seconds - minutes * 60 - hours * 3600;
      this.timeRemaining = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
      if (this.seconds === 0) {
        this.submitTest();
      }
    }, 1000);
    this.candidateTestService.loadQuestion.subscribe((data) => {
      this.question.nextQuestionId = data;
      this.displayQuestion();
    });
  }

  displayQuestion() {
    if (this.question.nextQuestionId && this.userId) {
      this.candidateTestService
        .getQuestion(this.question.nextQuestionId, this.userId)
        .subscribe({
          next: (response: ResponseModel<Question>) => {
            if (response.statusCode === StatusCode.Success) {
              this.question = response.data;
            } else {
              this.snackBarService.error(response.message);
            }
          },
        });
    }
  }

  onSubmit(event: Answer[]) {
    this.displayQuestion();
    this.saveAnswers(event);
    debugger;
    if (this.question.questionNumber === this.question.totalQuestions) {
      this.submitTest();
    }
    let state =
      event.filter((res) => res.isAnswer).length > 0
        ? QuestionStatus.Answered
        : QuestionStatus.Skipped;
    let status = [this.question.questionNumber - 1, this.question.id, state];
    this.candidateTestService.questionStatus.next(status);
  }

  saveAnswers(answers: Answer[]) {
    let answer: number[] = [];
    answers.forEach((isAnswer: Answer) => {
      if (isAnswer.isAnswer) {
        answer.push(isAnswer.optionId);
      }
    });
    let data: SaveAnswerModel = {
      questionId: this.question.id,
      timeRemaining: Math.floor(this.seconds / 60),
      userId: this.userId,
      userAnswers: answer,
      isAttended: true,
    };
    this.candidateTestService.saveAnswer(data).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.statusCode !== StatusCode.Success) {
          this.snackBarService.error(res.message);
        }
      },
    });
  }

  endTest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      message: 'Are you sure want to submit test?',
      confirmText: 'Finish',
      cancelText: 'Cancel',
    };
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result) {
        this.submitTest();
        this.router.navigate(['/user/submitted']);
      }
    });
  }

  submitTest() {
    this.candidateTestService.endTest(this.userId).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.statusCode == StatusCode.Success) {
          this.router.navigate(['/user/submitted']);
        }
      },
    });
  }

  getEndTime() {
    this.candidateTestService
      .getInstructionsOfTheTestForUser(this.userId, this.testStatus)
      .subscribe({
        next: (res) => {
          if (res.statusCode == StatusCode.Success) {
            this.endTime = res.data.endTime;
            this.timeRemainingToEndTime = Math.floor(
              (new Date(this.endTime).getTime() - new Date().getTime()) / 1000
            );
            if (this.timeRemainingToEndTime <= this.seconds) {
              this.seconds = this.timeRemainingToEndTime;
            }
          } else {
            this.snackBarService.error(res.message);
          }
        },
      });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
