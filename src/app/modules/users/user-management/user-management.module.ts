import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRountingModule } from './user-management-routing.module';
import { UserManagementComponent } from './components/user-management/user-management.component';


@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    UserManagementRountingModule
  ]
})
export class UserManagementModule { }
