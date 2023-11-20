import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: ``,
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'user',
    loadChildren: () =>
      import('./candidate-test/candidate-test.module').then(
        (m) => m.CandidateTestModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'candidate-test',
    loadChildren: () =>
      import('./candidate-test/candidate-test.module').then(
        (m) => m.CandidateTestModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
