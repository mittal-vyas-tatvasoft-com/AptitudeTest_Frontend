import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { QuestionTopics } from '../../interfaces/test.interface';
import { MarksAvailable } from '../../static/test.static';

@Component({
  selector: 'app-add-test-questions',
  templateUrl: './add-test-questions.component.html',
  styleUrls: ['./add-test-questions.component.scss'],
})
export class AddTestQuestionsComponent {
  @Input() form: FormGroup;
  @Input() singleAnswerQuestionTotalCountTopicWise = 0;
  @Input() multiAnswerQuestionTotalCountTopicWise = 0;
  @Input() singleMarksDropDownData = new BehaviorSubject<any>([]);
  @Input() multiMarksDropDownData = new BehaviorSubject<any>([]);
  @Input() topics: QuestionTopics[] = [];
  @Input() isEditMode: boolean;
  @Input() totalSelectedQuestions = 0;
  @Input() totalSelectedQuestionsMarks = 0;
  @Input() isDataValid: boolean;
  @Input() validationMSG = '';
  @Input() existingQuestionsTopicId: number[] = [];

  @Output() handleValidateSelectedMarks = new EventEmitter();
  @Output() handleMarksSum = new EventEmitter();
  @Output() addQuestions = new EventEmitter();
  MarksAvailable = MarksAvailable;

  handleValidateMarks() {
    this.handleValidateSelectedMarks.emit();
  }

  handleSumOfMarks() {
    this.handleMarksSum.emit();
  }

  add() {
    this.addQuestions.emit();
  }
}
