import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Answer,
  Question,
} from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { OptionsIndex } from 'src/app/modules/questions/static/question.static';
import { OptionType, QuestionType } from 'src/app/shared/common/enums';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mcq-question',
  templateUrl: './mcq-question.component.html',
  styleUrls: ['./mcq-question.component.scss'],
})
export class McqQuestionComponent {
  @Input() question: Question;
  @Output() saveAnswer = new EventEmitter<Answer[]>();
  @Output() endTestEvent = new EventEmitter<void>();
  optionIndex = OptionsIndex;
  optionType = OptionType;
  baseImageUrl = environment.baseURL.slice(0, -4) + 'Files/';

  toggleCheckbox(optionId: number) {
    if (this.question.questionType === QuestionType.SingleAnswer) {
      const count = this.question.answers.filter((ans: Answer) => {
        return ans.isAnswer;
      }).length;
      if (count > 0) {
        this.clearAnswer();
        this.setAnswer(optionId);
      }
    }
    this.setAnswer(optionId);
  }

  clearAnswer() {
    this.question.answers = this.question.answers.map((ans: Answer) => {
      return { isAnswer: false, optionId: ans.optionId };
    });
  }

  save() {
    this.saveAnswer.emit(this.question.answers);
  }

  setAnswer(optionId: number) {
    this.question.answers = this.question.answers.map((ans) => {
      if (ans.optionId == optionId) {
        return { isAnswer: !ans.isAnswer, optionId: optionId };
      }
      return ans;
    });
  }
  endTest() {
    this.endTestEvent.emit();
  }
}
