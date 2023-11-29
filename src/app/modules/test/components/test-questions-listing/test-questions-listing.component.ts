import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AllInsertedQuestionModel,
  TopicWiseQuestionData,
} from '../../interfaces/test.interface';

@Component({
  selector: 'app-test-questions-listing',
  templateUrl: './test-questions-listing.component.html',
  styleUrls: ['./test-questions-listing.component.scss'],
})
export class TestQuestionsListingComponent implements OnInit, AfterViewInit {
  @Input() allInsertedQuestions: AllInsertedQuestionModel[] = [];
  @Output() handleEditQuestionsDialog = new EventEmitter();
  @Output() handleDeleteQuestionsDialog = new EventEmitter();
  @Output() handleDeleteAllQuestionsDialog = new EventEmitter();
  dataToShow: AllInsertedQuestionModel[] = [];
  marksChipData: TopicWiseQuestionData[] = [];
  constructor(private cdr: ChangeDetectorRef) {}
  handleEditDialog() {
    this.handleEditQuestionsDialog.emit();
  }
  handleDeleteDialog(topicId: number) {
    this.handleDeleteQuestionsDialog.emit(topicId);
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngAfterChanges() {
    this.dataToShow = this.allInsertedQuestions;
    this.cdr.detectChanges();
  }

  deleteAllQuestions() {
    this.handleDeleteAllQuestionsDialog.emit();
  }
}
