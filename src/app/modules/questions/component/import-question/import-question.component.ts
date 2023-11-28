import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DropzoneComponent, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  DragDropInput,
  QuestionControls,
  dropzoneConfigCsv,
} from '../../configs/question.config';
import { QuestionsService } from '../../services/questions.service';
import {
  Topics,
  importQuestionSampleFileName,
  importQuestionSampleFilePath,
} from '../../static/question.static';
import { QuestionListComponent } from '../question-list/question-list.component';

@Component({
  selector: 'app-import-question',
  templateUrl: './import-question.component.html',
  styleUrls: ['./import-question.component.scss'],
})
export class ImportQuestionComponent {
  topics = Topics;
  public message = DragDropInput;
  topicForm: FormGroup;
  questionControls = QuestionControls;
  dropzoneConfig = dropzoneConfigCsv;
  formData: FormData = new FormData();
  fileName = '';
  isFile = false;
  isImportSuccess = false;
  count: number;
  @ViewChild(DropzoneComponent, { static: false })
  componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective)
  directive?: DropzoneDirective;
  @ViewChild(QuestionListComponent) questionList: QuestionListComponent;
  constructor(
    private location: Location,
    public dialog: MatDialog,
    public validation: ValidationService,
    public snackbarService: SnackbarService,
    private questionService: QuestionsService
  ) {}

  handleBackBtn() {
    this.location.back();
  }

  handleDeleteProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
  }

  onUploadSuccess(event: any) {
    this.isFile = true;
    this.fileName = event[0].name;
    this.formData.append('file', event[0]);
  }

  onUploadError(event: any) {
    this.resetFile();
    this.componentRef?.directiveRef?.reset();
    this.snackbarService.error(event[1]);
  }

  getValidation() {
    return this.isFile;
  }

  importQuestions() {
    this.questionService.importQuestions(this.formData).subscribe({
      next: (res: ResponseModel<number>) => {
        if (res.statusCode == StatusCode.Success) {
          this.questionList.initializeEmptyResponse();
          this.questionList.loadQuestions(
            this.questionList.response.pageSize,
            this.questionList.response.currentPageIndex
          );
          this.resetFile();
          this.count = res.data;
          this.isImportSuccess = true;
          this.componentRef?.directiveRef?.reset();
          this.snackbarService.success(res.message);
          setTimeout(() => {
            this.isImportSuccess = false;
          }, 3000);
        } else {
          this.resetFile();
          this.componentRef?.directiveRef?.reset();
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  resetFile() {
    this.isFile = false;
    this.fileName = '';
    this.formData.delete('file');
  }

  downloadSampleFile() {
    const filePath = importQuestionSampleFilePath;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = importQuestionSampleFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
