import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { TestRoutingModule } from './test-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './containers/test/test.component';
import { CreateTestComponent } from './containers/create-test/create-test.component';
import { EditQuestionComponent } from './containers/edit-question/edit-question.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { TestGroupComponent } from './components/test-group/test-group.component';
import { TestQuestionsComponent } from './components/test-questions/test-questions.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';

@NgModule({
  declarations: [
    TestComponent,
    CreateTestComponent,
    EditQuestionComponent,
    BasicDetailsComponent,
    TestGroupComponent,
    TestQuestionsComponent,
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    SharedMaterialModule,
    FormControlModule,
    ReactiveFormsModule,
    TablesModule,
  ],
  providers: [TestService],
})
export class TestModule {}
