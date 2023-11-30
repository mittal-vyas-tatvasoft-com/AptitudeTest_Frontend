import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'src/app/candidate-test/containers/candidate-test/components/register/register.component';
import { Navigation } from 'src/app/shared/common/enums';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
