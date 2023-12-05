import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/candidate-test/interfaces/candidate-test.interface';
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
  @Output() saveAnswer = new EventEmitter<boolean[]>();
  @Output() endTestEvent = new EventEmitter<void>();
  optionIndex = OptionsIndex;
  optionType = OptionType;
  baseImageUrl = environment.baseURL.slice(0, -4) + 'Files/';

  toggleCheckbox(index: number) {
    if (this.question.questionType === QuestionType.SingleAnswer) {
      const count = this.question.answers.filter(Boolean).length;
      if (count > 0) {
        for (let i = 0; i < 4; i++) {
          if (index === i) {
            continue;
          }
          this.question.answers[i] = false;
        }
      }
    }
    this.question.answers[index] = !this.question.answers[index];
  }

  clearAnswer() {
    this.question.answers = [false, false, false, false];
  }

  save() {
    this.saveAnswer.emit(this.question.answers);
  }

  endTest() {
    this.endTestEvent.emit();
  }
}
