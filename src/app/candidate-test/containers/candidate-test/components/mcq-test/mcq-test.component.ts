import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { QuestionStatus } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.scss'],
})
export class McqTestComponent implements OnInit {
  firstName: string;
  lastName: string;
  timeRemaining = {
    hours: 1,
    minutes: 20,
    seconds: 0,
  };
  seconds = 0;
  totalCount = 50;
  currentCount = 35;
  question: Question = {
    questionText:
      'Occaecat in sint nulla cillum exercitation culpa aliquip enimconsequat quis adipisicing do dolor qui reprehenderit excepteur.',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    optionType: 1,
    questionType: 1,
  };

  constructor(
    public loginService: LoginService,
    private router: Router,
    private testService: CandidateTestService
  ) {}
  ngOnInit(): void {
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
    const candidateDetails = this.loginService.decodeToken();
    this.firstName = candidateDetails.FirstName;
    this.lastName = candidateDetails.Name;
  }

  onSubmit(event: boolean[]) {
    if (this.currentCount == this.totalCount) {
      this.router.navigate(['/user/submitted']);
    }
    this.currentCount++;
    this.testService;
    let state =
      event.filter(Boolean).length > 0
        ? QuestionStatus.Answered
        : QuestionStatus.Skipped;
    let status = [this.currentCount - 1, state];
    this.testService.questionStatus.next(status);
  }
}
