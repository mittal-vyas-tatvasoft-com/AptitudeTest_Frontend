import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navigation } from '../shared/common/enums';
import { CoreComponent } from './core.component';
import { RoleGuard } from './guards/role/role.guard';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [Navigation.RoleAdmin] },
    children: [
      {
        path: `${Navigation.Masters}`,
        loadChildren: () =>
          import('../modules/masters/masters.module').then(
            (m) => m.MastersModule
          ),
      },
      {
        path: `${Navigation.Candidate}`,
        loadChildren: () =>
          import('../modules/candidate/candidate.module').then(
            (m) => m.CandidateModule
          ),
      },
      {
        path: `${Navigation.Questions}`,
        loadChildren: () =>
          import('../modules/questions/questions.module').then(
            (m) => m.QuestionsModule
          ),
      },
      {
        path: `${Navigation.Tests}`,
        loadChildren: () =>
          import('../modules/test/test.module').then((m) => m.TestModule),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('../modules/groups/groups.module').then((m) => m.GroupsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
