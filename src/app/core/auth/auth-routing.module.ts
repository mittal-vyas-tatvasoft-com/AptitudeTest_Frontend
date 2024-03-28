import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateProfileComponent } from 'src/app/candidate-test/containers/candidate-test/components/candidate-profile/candidate-profile.component';
import { RegisterComponent } from 'src/app/candidate-test/containers/candidate-test/components/register/register.component';
import { Navigation } from 'src/app/shared/common/enums';
import { AuthGuard } from '../guards/auth/auth.guard';
import { OffCampusModeGuard } from '../guards/offCampusMode/off-campus-mode.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: Navigation.AdminLogin,
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: Navigation.AdminLogin,
    component: LoginComponent,
  },
  {
    path: Navigation.ForgotPassword,
    component: ForgotPasswordComponent,
  },
  {
    path: Navigation.ResetPassword,
    component: ResetPasswordComponent,
  },
  {
    path: Navigation.Register,
    component: RegisterComponent,
    //canActivate: [OffCampusModeGuard],
  },
  {
    path: `${Navigation.Edit}/:id`,
    component: CandidateProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
