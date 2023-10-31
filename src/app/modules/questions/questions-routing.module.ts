import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './component/questions/questions.component';
import { Navigation } from 'src/app/shared/common/enum';
import { AddQuestionComponent } from './component/add-question/add-question.component';
import { ImportQuestionComponent } from './component/import-question/import-question.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
  },
  {
    path: `${Navigation.AddQuestion}`,
    component: AddQuestionComponent,
  },
  {
    path: `${Navigation.ImportQuestion}`,
    component: ImportQuestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionsRoutingModule {}
