import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CandidateTestRoutingModule } from './candidate-test-routing.module';

import { AuthModule } from '../core/auth/auth.module';
import { CoreModule } from '../core/core.module';
import { CandidateModule } from '../modules/candidate/candidate.module';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateTestComponent } from './containers/candidate-test/components/candidate-test/candidate-test.component';
import { McqTestComponent } from './containers/candidate-test/components/mcq-test/mcq-test.component';
import { RegisterComponent } from './containers/candidate-test/components/register/register.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CandidateInstructionsComponent,
    TestSubmittedComponent,
    CandidateTestComponent,
    McqTestComponent,
    LayoutComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    CandidateTestRoutingModule,
    SharedMaterialModule,
    CoreModule,
    AuthModule,
    CandidateModule,
  ],
})
export class CandidateTestModule {}
