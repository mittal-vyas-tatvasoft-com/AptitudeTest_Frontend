import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './containers/layout/layout.component';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateWelcomeComponent } from './containers/candidate-welcome/candidate-welcome.component';
import { CandidateTestComponent } from './containers/candidate-test/candidate-test.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';
import { CandidateRegisterComponent } from './containers/candidate-register/candidate-register.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'welcome', component: CandidateWelcomeComponent },
            { path: 'instruction', component: CandidateInstructionsComponent },
            { path: 'test', component: CandidateTestComponent },
            { path: 'register', component: CandidateRegisterComponent },
            { path: 'submitted', component: TestSubmittedComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CandidateTestRoutingModule { }