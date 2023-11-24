import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { QuestionTopics } from '../../interfaces/test.interface';

@Component({
  selector: 'app-add-test-questions',
  templateUrl: './add-test-questions.component.html',
  styleUrls: ['./add-test-questions.component.scss'],
})
export class AddTestQuestionsComponent {
  @Input() form: FormGroup;
  @Input() singleAnswerQuestionTotalCountTopicWise: number = 0;
  @Input() multiAnswerQuestionTotalCountTopicWise: number = 0;
  @Input() singleMarksDropDownData = new BehaviorSubject<any>([]);
  @Input() multiMarksDropDownData = new BehaviorSubject<any>([]);
  @Input() topics: QuestionTopics[] = [];
  @Input() isEditMode: boolean;
  @Input() totalSelectedQuestions: number = 0;
  @Input() totalSelectedQuestionsMarks: number = 0;
  @Input() isDataValid: boolean;
  @Input() validationMSG: string = '';
  @Input() existingQuestionsTopicId: number[] = [];

  @Output() handleValidateSelectedMarks = new EventEmitter();
  @Output() handleMarksSum = new EventEmitter();
  @Output() addQuestions = new EventEmitter();

  ngOnInit() {}

  ngAfterViewInit() {}

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
