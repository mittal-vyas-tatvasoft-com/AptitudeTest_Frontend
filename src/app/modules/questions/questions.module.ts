import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsRoutingModule } from './questions-routing.module';
import { QuestionsComponent } from './component/questions/questions.component';
import { AddQuestionComponent } from './component/add-question/add-question.component';
import { ImportQuestionComponent } from './component/import-question/import-question.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { QuestionsService } from './services/questions.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionListComponent } from './component/question-list/question-list.component';
import { QuillModule } from 'ngx-quill';
@NgModule({
  declarations: [
    QuestionsComponent,
    AddQuestionComponent,
    ImportQuestionComponent,
    QuestionListComponent,
  ],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ],
  providers: [QuestionsService],
})
export class QuestionsModule {}
