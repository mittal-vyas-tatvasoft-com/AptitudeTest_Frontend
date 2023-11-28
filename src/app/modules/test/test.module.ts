import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { AddTestQuestionsComponent } from './components/add-test-questions/add-test-questions.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { TestGroupComponent } from './components/test-group/test-group.component';
import { TestQuestionsListingComponent } from './components/test-questions-listing/test-questions-listing.component';
import { TestQuestionsComponent } from './components/test-questions/test-questions.component';
import CreateTestComponent from './containers/create-test/create-test.component';
import { EditQuestionComponent } from './containers/edit-question/edit-question.component';
import { TestComponent } from './containers/test/test.component';
import { TestService } from './services/test.service';
import { TestRoutingModule } from './test-routing.module';

@NgModule({
  declarations: [
    TestComponent,
    CreateTestComponent,
    EditQuestionComponent,
    BasicDetailsComponent,
    TestGroupComponent,
    TestQuestionsComponent,
    AddTestQuestionsComponent,
    TestQuestionsListingComponent,
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
