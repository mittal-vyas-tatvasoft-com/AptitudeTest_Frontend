import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSelectionRountingModule } from './user-selection-rounting.module';
import { UserSelectionComponent } from './components/user-selection/user-selection.component';



@NgModule({
  declarations: [
    UserSelectionComponent
  ],
  imports: [
    CommonModule,
    UserSelectionRountingModule
  ]
})
export class UserSelectionModule { }
