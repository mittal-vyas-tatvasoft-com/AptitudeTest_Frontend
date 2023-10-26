import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navigation } from '../shared/common/enum';
import { AuthGuard } from './guards/auth/auth.guard';
import { CoreComponent } from './core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    data: { breadCrumb: 'Admin' },
    children: [
      {
        path: `${Navigation.Masters}`,
        loadChildren: () =>
          import(
            '../modules/masters/masters.module'
          ).then((m) => m.MastersModule),
      },
      {
        path: `${Navigation.Candidate}`,
        loadChildren: () =>
          import(
            '../modules/candidate/candidate.module'
          ).then((m) => m.CandidateModule),
      },
      {
        path: `${Navigation.Groups}`,
        loadChildren: () =>
          import(
            '../modules/groups/groups.module'
          ).then((m) => m.GroupsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CoreRoutingModule { }