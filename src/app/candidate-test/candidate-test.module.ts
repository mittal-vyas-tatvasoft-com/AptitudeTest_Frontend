import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateTestRoutingModule } from './candidate-test-routing.module';

import { McqTestComponent } from './containers/candidate-test/components/mcq-test/mcq-test.component';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateTestComponent } from './containers/candidate-test/components/candidate-test/candidate-test.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { CoreModule } from '../core/core.module';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { AuthModule } from '../core/auth/auth.module';



@NgModule({
    declarations: [
        DashboardComponent,
        CandidateInstructionsComponent,
        TestSubmittedComponent,
        CandidateTestComponent,
        McqTestComponent,
        LayoutComponent
    ],
    imports: [
        CommonModule,
        CandidateTestRoutingModule,
        SharedMaterialModule,
        CoreModule,
        AuthModule
    ]
})
export class CandidateTestModule { }