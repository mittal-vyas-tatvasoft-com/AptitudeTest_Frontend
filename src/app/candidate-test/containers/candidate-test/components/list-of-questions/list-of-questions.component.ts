import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
  };
  questionStatus = QuestionStatus;
  constructor(private testService: CandidateTestService) {}

  ngOnInit(): void {
    this.testService.questionStatus.subscribe((data) => {
      this.questionsStatus.questionStatusVMs[data[0] - 1].status = data[2];
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
