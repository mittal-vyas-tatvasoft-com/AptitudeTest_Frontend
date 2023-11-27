import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuestionsService } from '../../services/questions.service';
import {
  Numbers,
  OptionType,
  QuestionTopic,
  QuestionType,
  StatusCode,
} from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { QuestionCount } from 'src/app/shared/common/interfaces/question-count.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';
import { Question } from 'src/app/modules/questions/interfaces/question.interface';
import { Subject } from 'rxjs';
import { OptionList, Topics } from '../../static/question.static';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  optionsList: string[] = OptionList;
  questions: any[] = [];
  questionCount: QuestionCount = {
    mathsCount: Numbers.Zero,
    reasoningCount: Numbers.Zero,
    technicalCount: Numbers.Zero,
    totalCount: Numbers.Zero,
  };
  optionType = OptionType;
  questionTopic = QuestionTopic;
  questionType = QuestionType;
  topics = Topics;
  filterForm: FormGroup;
  response: Pagination<Question>;
  topic?: number;
  status?: boolean;
  private scrollSubject = new Subject<number>();
  constructor(
    public dialog: MatDialog,
    private questionService: QuestionsService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getQuestionCount();

    this.filterForm = this.fb.group({
      topic: [''],
      status: [''],
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.topic = res.topic;
      this.status = res.status;
      this.getQuestionCount(res.topic, res.status);
    });
  }

  getQuestionCount(topic?: number, status?: boolean) {
    this.questionService.getQuestionCount(topic, status).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.questionCount = res.data;
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }
}
