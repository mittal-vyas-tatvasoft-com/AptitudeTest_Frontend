import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { RoleGuard } from '../core/guards/role/role.guard';
import { Navigation } from '../shared/common/enums';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { CandidateInstructionsComponent } from './containers/candidate-instructions/candidate-instructions.component';
import { CandidateTestComponent } from './containers/candidate-test/components/candidate-test/candidate-test.component';
import { TestSubmittedComponent } from './containers/test-submitted/test-submitted.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [Navigation.RoleUser] },
    children: [
      {
        path: ``,
        component: DashboardComponent,
      },
      {
        path: `instructions`,
        component: CandidateInstructionsComponent,
      },
      {
        path: `test`,
        component: CandidateTestComponent,
      },
      {
        path: `submitted`,
        component: TestSubmittedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateTestRoutingModule {}
