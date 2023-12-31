import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role/role.guard';
import { Navigation } from './shared/common/enums';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: ``,
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [Navigation.RoleAdmin] },
  },

  {
    path: 'user',
    loadChildren: () =>
      import('./candidate-test/candidate-test.module').then(
        (m) => m.CandidateTestModule
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [Navigation.RoleUser] },
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
