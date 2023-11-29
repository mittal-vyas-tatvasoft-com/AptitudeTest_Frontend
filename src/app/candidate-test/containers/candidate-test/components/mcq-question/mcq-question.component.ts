import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { OptionsIndex } from 'src/app/modules/questions/static/question.static';
import { QuestionType } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-mcq-question',
  templateUrl: './mcq-question.component.html',
  styleUrls: ['./mcq-question.component.scss'],
})
export class McqQuestionComponent {
  @Input() question: Question;
  @Output() saveAnswer = new EventEmitter<boolean[]>();
  optionIndex = OptionsIndex;
  answers: boolean[] = [false, false, false, false];

  toggleCheckbox(index: number) {
    if (this.question.questionType == QuestionType.SingleAnswer) {
      const count = this.answers.filter(Boolean).length;
      if (count > 0) {
        for (let i = 0; i < 4; i++) {
          if (index == i) {
            continue;
          }
          this.answers[i] = false;
        }
      }
    }
    this.answers[index] = !this.answers[index];
  }

  clearAnswer() {
    this.answers = [false, false, false, false];
  }

  save() {
    this.saveAnswer.emit(this.answers);
  }
}
