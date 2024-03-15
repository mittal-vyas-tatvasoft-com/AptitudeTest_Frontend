import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Answer,
  Question,
  QuestionTimerDetail,
  SaveAnswerModel,
  UpdateTestTimeModel,
  UpdateUserTestStatusModel,
} from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { CandidateService } from 'src/app/modules/candidate/services/candidate.service';
import {
  Navigation,
  QuestionStatus,
  QuestionTopic,
  StatusCode,
} from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { Subscription } from 'rxjs';
import { RefreshKey } from 'src/app/candidate-test/static/candidate-test.static';

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
  timeRemainingForExam = {
    hours: '0',
    minutes: '0',
    seconds: '0',
  };

  timeSpent = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  timeSpentForQuestion = {
    hours: '0',
    minutes: '0',
    seconds: '0',
  };
  currentTimeSpentForQuestionInSeconds: number;
  key: string;
  totalTimeSpentForQuestionInSeconds: number;
  keys: string[] = [];
  topic: string;
  endTime: string;
  remainingHours = '';
  remainingMinutes = '';
  remainingSeconds = '';
  timeRemainingToEndTime: number;
  @Input() remainingSecondsForExam = 0;
  @Input() isQuestionMenu: boolean;
  question: Question = {
    id: 0,
    questionText: '',
    options: [],
    optionType: 0,
    questionType: 0,
    topic: 0,
    difficulty: 0,
    nextQuestionId: -1,
    questionNumber: 0,
    totalQuestions: 0,
    answers: [],
  };
  interval: any;
  updateTimeInterval: any;
  questionTimeInterval: any;
  tabChangeInterval: any;
  loadQuestionSubscription: Subscription;
  constructor(
    public loginService: LoginService,
    private router: Router,
    private candidateTestService: CandidateTestService,
    private candidateService: CandidateService,
    private snackBarService: SnackbarService,
    public dialog: MatDialog,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const candidateDetails = this.loginService.decodeToken();
    this.firstName = candidateDetails.FirstName;
    this.lastName = candidateDetails.Name;
    this.userId = candidateDetails.Id;
    this.loginService.isUpdateTime = true;
    this.tabChangeInterval = setInterval(() => {
      this.checkTabActivity();
    }, 1000);
    this.getEndTime();
    this.interval = setInterval(() => {
      this.remainingSecondsForExam = this.remainingSecondsForExam - 1;
      let hours = Math.floor(this.remainingSecondsForExam / 3600);
      let minutes = Math.floor((this.remainingSecondsForExam % 3600) / 60);
      let seconds = this.remainingSecondsForExam - minutes * 60 - hours * 3600;
      if (hours <= 9) {
        this.remainingHours = '0' + hours;
      } else {
        this.remainingHours = hours.toString();
      }
      if (minutes <= 9) {
        this.remainingMinutes = '0' + minutes;
      } else {
        this.remainingMinutes = minutes.toString();
      }
      if (seconds <= 9) {
        this.remainingSeconds = '0' + seconds;
      } else {
        this.remainingSeconds = seconds.toString();
      }
      this.timeRemaining = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
      this.timeRemainingForExam = {
        hours: this.remainingHours,
        minutes: this.remainingMinutes,
        seconds: this.remainingSeconds,
      };
      this.loginService.remainingExamTimeInSeconds =
        this.remainingSecondsForExam;
      if (this.remainingSecondsForExam === 0) {
        this.submitTest();
      }
    }, 1000);
    this.updateTimeInterval = setInterval(() => {
      if (this.userId > 0 && this.remainingSecondsForExam > 0) {
        let data: UpdateTestTimeModel = {
          userId: this.userId,
          remainingTime: this.remainingSecondsForExam,
        };
        this.updateTime(data);
      }
    }, 60000);
    this.loadQuestionSubscription =
      this.candidateTestService.loadQuestion.subscribe((data) => {
        if (data != -1) {
          this.question.nextQuestionId = data;
          this.displayQuestion();
        }
      });
    if (
      this.loadQuestionSubscription &&
      this.candidateTestService.loadQuestion.getValue() === -1
    ) {
      this.displayQuestion();
    }
  }

  checkTabActivity() {
    if (document.hidden) {
      const updateUserTestStatusModel: UpdateUserTestStatusModel = {
        isActive: false,
        userId: this.userId,
      };
      this.candidateTestService
        .updateUserTestStatus(updateUserTestStatusModel)
        .subscribe();

      this.loginService.logout();
    }
  }

  displayQuestion() {
    clearInterval(this.questionTimeInterval);
    this.updateQuestionTimer();
    if (this.question.nextQuestionId && this.userId) {
      this.candidateTestService
        .getQuestion(this.question.nextQuestionId, this.userId)
        .subscribe({
          next: (response: ResponseModel<Question>) => {
            if (response.statusCode === StatusCode.Success) {
              this.key = response.data.id.toString() + '-' + this.userId;
              this.startQuestionTimer();
              setTimeout(() => {
                this.question = response.data;
                this.topic = QuestionTopic[response.data.topic];
              }, 1000);
              this.keys.push(this.key);
            } else {
              this.snackBarService.error(response.message);
            }
          },
        });
    }
  }

  startQuestionTimer() {
    this.currentTimeSpentForQuestionInSeconds = 1;
    this.questionTimeInterval = setInterval(() => {
      const time = localStorage.getItem(this.key);
      this.currentTimeSpentForQuestionInSeconds = time ? JSON.parse(time) : 0;

      this.currentTimeSpentForQuestionInSeconds =
        this.currentTimeSpentForQuestionInSeconds + 1;

      localStorage.setItem(
        this.key,
        JSON.stringify(this.currentTimeSpentForQuestionInSeconds)
      );

      let hours = Math.floor(this.currentTimeSpentForQuestionInSeconds / 3600);
      let minutes = Math.floor(
        (this.currentTimeSpentForQuestionInSeconds % 3600) / 60
      );
      let seconds =
        this.currentTimeSpentForQuestionInSeconds - minutes * 60 - hours * 3600;

      this.timeSpentForQuestion.hours = (
        hours > 9 ? hours : `0${hours}`
      ).toString();

      this.timeSpentForQuestion.minutes = (
        minutes > 9 ? minutes : `0${minutes}`
      ).toString();

      this.timeSpentForQuestion.seconds = (
        seconds > 9 ? seconds : `0${seconds}`
      ).toString();

      this.timeSpent = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }, 1000);
  }

  endQuestionTimer(): number {
    return this.getTimeSpentInSeconds();
  }

  getTimeSpentInSeconds(): number {
    var value = localStorage.getItem(this.key);
    return (this.totalTimeSpentForQuestionInSeconds = value
      ? JSON.parse(value)
      : null);
  }

  updateQuestionTimer() {
    let data: QuestionTimerDetail = {
      questionId: this.question.id,
      userId: this.userId,
      timeSpent: this.getTimeSpentInSeconds(),
    };
    if (data.timeSpent != null) {
      this.candidateTestService.updateQuestionTimer(data).subscribe({
        next: (res: ResponseModel<string>) => {},
      });
    }
  }

  onSubmit(event: { answers: Answer[]; questionNumber: number }) {
    if (event.questionNumber !== this.question.totalQuestions) {
      this.displayQuestion();
    }

    this.saveAnswers(event);
    let state =
      event.answers.filter((res) => res.isAnswer).length > 0
        ? QuestionStatus.Answered
        : QuestionStatus.Skipped;
    let status = [this.question.questionNumber - 1, this.question.id, state];
    this.candidateTestService.questionStatus.next(status);
  }

  saveAnswers(event: { answers: Answer[]; questionNumber: number }) {
    let answer: number[] = [];
    event.answers.forEach((isAnswer: Answer) => {
      if (isAnswer.isAnswer) {
        answer.push(isAnswer.optionId);
      }
    });

    let data: SaveAnswerModel = {
      questionId: this.question.id,
      timeRemaining: Math.floor(this.remainingSecondsForExam),
      userId: this.userId,
      userAnswers: answer,
      isAttended: true,
      timeSpent: this.endQuestionTimer(),
    };

    this.candidateTestService.saveAnswer(data).subscribe({
      next: (res: ResponseModel<string>) => {
        this.candidateTestService.isSavingAnswer = false;
        if (res.statusCode === StatusCode.Success) {
          if (event.questionNumber === this.question.totalQuestions) {
            if (!this.isQuestionMenu) {
              this.submitTest();
            }
          }
        } else {
          this.snackBarService.error(res.message);
        }
      },
      error: () => {
        this.candidateTestService.isSavingAnswer = false;
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
      }
    });
  }

  submitTest() {
    this.candidateTestService.endTest(this.userId).subscribe({
      next: (res: ResponseModel<string>) => {
        this.candidateTestService.isEndingTest = false;
        if (res.statusCode === StatusCode.Success) {
          this.clearStorage();
          this.router.navigate(['/user/submitted']);
        }
      },
      error: () => {
        this.candidateTestService.isEndingTest = false;
      },
    });
  }

  clearStorage() {
    this.keys.forEach((questionKey) => {
      localStorage.removeItem(questionKey);
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

            if (this.timeRemainingToEndTime <= this.remainingSecondsForExam) {
              this.remainingSecondsForExam = this.timeRemainingToEndTime;
            }
          } else {
            this.snackBarService.error(res.message);
          }
        },
      });
  }

  updateTime(data: UpdateTestTimeModel) {
    this.candidateTestService.updateTime(data).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.statusCode !== StatusCode.Success) {
          this.snackBarService.error(res.message);
        }
      },
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  HandleRefreshOrTabClose(event: any) {
    localStorage.setItem('isRefresh', 'true');
    this.candidateTestService
      .updateTime({
        userId: this.userId,
        remainingTime: this.remainingSecondsForExam,
      })
      .subscribe();
  }

  ngOnDestroy() {
    if (this.loadQuestionSubscription) {
      this.loadQuestionSubscription.unsubscribe();
    }
    clearInterval(this.questionTimeInterval);
    clearInterval(this.interval);
    clearInterval(this.updateTimeInterval);
    clearInterval(this.tabChangeInterval);
  }
}
