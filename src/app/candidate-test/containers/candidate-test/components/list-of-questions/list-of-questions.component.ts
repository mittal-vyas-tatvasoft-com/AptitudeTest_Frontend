import { Component, Input, OnInit } from '@angular/core';
import { QuestionStatusModel } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
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
    });
  }

  fetchQuestion(id: number) {
    this.testService.loadQuestion.next(id);
  }
}
