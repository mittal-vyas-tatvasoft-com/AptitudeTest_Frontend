import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateTestRoutingModule } from './candidate-test-routing.module';

import { McqTestComponent } from './containers/candidate-test/components/mcq-test/mcq-test.component';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateTestComponent } from './containers/candidate-test/components/candidate-test/candidate-test.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { CoreModule } from "src/app/core/core.module";
import { CandidateWelcomeComponent } from './containers/candidate-welcome/candidate-welcome.component';
import { CandidateRegisterComponent } from './containers/candidate-register/candidate-register.component';



@NgModule({
    declarations: [
        CandidateInstructionsComponent,
        TestSubmittedComponent,
        CandidateTestComponent,
        McqTestComponent,
        LayoutComponent,
        CandidateWelcomeComponent,
        CandidateRegisterComponent
    ],
    imports: [
        CommonModule,
        CandidateTestRoutingModule,
        SharedMaterialModule,
        CoreModule
    ]
})
export class CandidateTestModule { }