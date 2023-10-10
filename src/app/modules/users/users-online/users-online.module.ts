import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersOnlineRountingModule } from './users-online-rounting.module';
import { UsersOnlineComponent } from './components/users-online/users-online.component';

@NgModule({
  declarations: [
    UsersOnlineComponent
  ],
  imports: [
    CommonModule,
    UsersOnlineRountingModule
  ]
})
export class UsersOnlineModule { }
