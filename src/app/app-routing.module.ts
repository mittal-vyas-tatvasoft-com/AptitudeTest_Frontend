import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  // {
  //   path:'',
  //   component: AppComponent
  // },
  // {
  //   path: '',
  //   redirectTo: 'users',
  //   pathMatch: 'full',
  // },
  // {
  //   path: ``,
  //   loadChildren: () =>
  //     import('./core/auth/auth.module').then((m) => m.AuthModule),
  // },
  {
    path: ``,
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'masters',
    loadChildren: () =>
      import('./modules/masters/masters.module').then((m) => m.MastersModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/users/users.module').then((m) => m.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
