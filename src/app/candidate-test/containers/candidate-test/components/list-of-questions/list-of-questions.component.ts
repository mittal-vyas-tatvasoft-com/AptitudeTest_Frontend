import { Component, Input, OnInit } from '@angular/core';
import { retry } from 'rxjs';
import { QuestionStatusModel } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { Status } from 'src/app/modules/questions/static/question.static';
import { QuestionStatus } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-list-of-questions',
  templateUrl: './list-of-questions.component.html',
  styleUrls: ['./list-of-questions.component.scss'],
})
export class ListOfQuestionsComponent implements OnInit {
  @Input() questionsStatus: QuestionStatusModel = {
    answered: 0,
    questionStatusVMs: [],
    totalQuestion: 0,
    unAnswered: 0,
    timeLeft: 0,
    isQuestionsMenu: false,
  };
  questionStatus = QuestionStatus;
  currentStatus = this.questionStatus.Unvisited;
  constructor(private testService: CandidateTestService) {}

  ngOnInit(): void {
    this.testService.questionStatus.subscribe((data) => {
      // Here data is array of numbers with size 3
      // It contains index of question,Question Id and its Status respectively on array index 0,1and 2
      this.questionsStatus.questionStatusVMs[data[0]].status = data[2];
      this.questionsStatus.answered =
        this.questionsStatus.questionStatusVMs.filter(
          (question) => question.status === this.questionStatus.Answered
        ).length;
      this.questionsStatus.unAnswered =
        this.questionsStatus.questionStatusVMs.filter(
          (question) => question.status === this.questionStatus.Skipped
        ).length;
      //Here we get Index of previous Question in data[0]
      // so data[0]+1 will give us index of current question
      // and data[0]+2 will give current question number
      if (this.questionsStatus.questionStatusVMs.length >= data[0] + 2) {
        this.currentStatus =
          this.questionsStatus.questionStatusVMs[data[0] + 1].status;
        this.questionsStatus.questionStatusVMs[data[0] + 1].status =
          this.questionStatus.Current;
      }
      if (this.questionsStatus.questionStatusVMs.length === data[0] + 1) {
        this.currentStatus =
          this.questionsStatus.questionStatusVMs[data[0]].status;
        this.questionsStatus.questionStatusVMs[data[0]].status =
          this.questionStatus.Current;
      }
    });
  }

  fetchQuestion(id: number) {
    this.questionsStatus.questionStatusVMs =
      this.questionsStatus.questionStatusVMs.map((data) => {
        if (data.status == this.questionStatus.Current) {
          data.status = this.currentStatus;
          return data;
        } else {
          return data;
        }
      });
    this.questionsStatus.questionStatusVMs =
      this.questionsStatus.questionStatusVMs.map((data) => {
        if (data.questionId == id) {
          this.currentStatus = data.status;
          data.status = this.questionStatus.Current;
          return data;
        } else {
          return data;
        }
      });
    this.testService.loadQuestion.next(id);
  }
}
