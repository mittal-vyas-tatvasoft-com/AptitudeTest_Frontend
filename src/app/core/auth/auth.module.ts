import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { CoreModule } from '../core.module';
import { SharedMaterialModule } from '../../shared/material/shared-material.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangePasswordActionComponent } from './components/change-password-action/change-password-action.component';
import { ChangeUserPasswordComponent } from './components/change-user-password/change-user-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ChangePasswordActionComponent,
    ChangeUserPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlModule,
    SharedMaterialModule,
    CoreModule,
  ],
})
export class AuthModule {}
