import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navigation } from '../shared/common/enums';
import { CoreComponent } from './core.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { RoleGuard } from './guards/role/role.guard';

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
        path: `${Navigation.Groups}`,
        loadChildren: () =>
          import('../modules/groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: `${Navigation.Setting}`,
        loadChildren: () =>
          import('../modules/setting/setting.module').then(
            (m) => m.SettingModule
          ),
      },
      {
        path: `${Navigation.Results}`,
        loadChildren: () =>
          import('../modules/results/results.module').then(
            (m) => m.ResultsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
