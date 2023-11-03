import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  OptionType,
  QuestionTopic,
  QuestionType,
  StatusCode,
} from 'src/app/shared/common/enums';
import { UpdateStatus } from 'src/app/shared/common/interfaces/update-status';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { QuestionsService } from '../../services/questions.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  @Input() questions: any[] = [];
  optionType = OptionType;
  questionTopic = QuestionTopic;
  questionType = QuestionType;
  topics = [
    {
      id: 1,
      name: 'Maths',
    },
    {
      id: 2,
      name: 'Reasoning',
    },
    {
      id: 3,
      name: 'Technical',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private questionService: QuestionsService
  ) {}

  ngOnInit(): void {}

  getTopicName(topicId: number) {
    return this.topics.find((x) => x.id == topicId)?.name;
  }

  updateStatus(status: UpdateStatus) {
    this.questionService.updateStatus(status).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.questions = this.questions.map((q) => {
            if (q.id == status.id) {
              return { ...q, status: status.status };
            } else {
              return q;
            }
          });
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handleDeleteProfileDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.questionService.delete(id).subscribe({
            next: (res: any) => {
              if (res.statusCode == StatusCode.Success) {
                this.questions = this.questions.filter(
                  (data: any) => data.id != id
                );
                this.snackbarService.success(res.message);
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
        }
      });
  }
}
