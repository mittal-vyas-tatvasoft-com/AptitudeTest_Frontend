import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  getSelectedAns(optionId: number) {
    return this.question.answers.find((d) => d.optionId === optionId)?.isAnswer;
  }

  toggleCheckbox(optionId: number) {
    console.log(optionId);
    if (this.question.questionType === QuestionType.SingleAnswer) {
      this.clearAnswer(optionId);
    }
    this.setAnswer(optionId);
  }

  clearAnswer(optionId: number = 0) {
    this.question.answers = this.question.answers.map((ans: Answer) => {
      if (ans.optionId !== optionId) {
        return { isAnswer: false, optionId: ans.optionId };
      }
      return ans;
    });
  }

  save() {
    this.saveAnswer.emit(this.question.answers);
  }

  setAnswer(optionId: number) {
    this.question.answers = this.question.answers.map((ans) => {
      if (ans.optionId === optionId) {
        return { isAnswer: !ans.isAnswer, optionId: optionId };
      }
      return ans;
    });
  }

  endTest() {
    this.endTestEvent.emit();
  }
}
