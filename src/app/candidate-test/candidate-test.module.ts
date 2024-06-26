import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CandidateTestRoutingModule } from './candidate-test-routing.module';

import { WebcamModule } from 'ngx-webcam';
import { AuthModule } from '../core/auth/auth.module';
import { CoreModule } from '../core/core.module';
import { CandidateModule } from '../modules/candidate/candidate.module';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateProfileComponent } from './containers/candidate-test/components/candidate-profile/candidate-profile.component';
import { CandidateTestComponent } from './containers/candidate-test/components/candidate-test/candidate-test.component';
import { ListOfQuestionsComponent } from './containers/candidate-test/components/list-of-questions/list-of-questions.component';
import { McqQuestionComponent } from './containers/candidate-test/components/mcq-question/mcq-question.component';
import { McqTestComponent } from './containers/candidate-test/components/mcq-test/mcq-test.component';
import { RegisterComponent } from './containers/candidate-test/components/register/register.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';
import { PreventContextMenuDirective } from '../shared/directives/prevent-context-menu.directive';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    CandidateInstructionsComponent,
    TestSubmittedComponent,
    CandidateTestComponent,
    McqTestComponent,
    LayoutComponent,
    RegisterComponent,
    ListOfQuestionsComponent,
    McqQuestionComponent,
    CandidateProfileComponent,
  ],
  imports: [
    CommonModule,
    CandidateTestRoutingModule,
    SharedMaterialModule,
    CoreModule,
    AuthModule,
    CandidateModule,
    WebcamModule,
    SharedModule,
  ],
})
export class CandidateTestModule {}
