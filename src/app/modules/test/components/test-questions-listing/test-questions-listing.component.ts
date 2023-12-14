import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
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
  testCreatedMessage = 'Test Created Successfully';
  constructor(
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
  handleEditDialog(questionData: any, allInsertedQuestions: any) {
    this.handleEditQuestionsDialog.emit({ questionData, allInsertedQuestions });
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
  showTestCreatedSnackbar() {
    this.snackbarService.success(this.testCreatedMessage);
    this.router.navigate(['/admin/tests']);
  }
}
