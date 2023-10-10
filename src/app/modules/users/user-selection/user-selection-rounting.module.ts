import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSelectionComponent } from './components/user-selection/user-selection.component';

const routes: Routes = [
  {
    path:'',
    component:UserSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSelectionRountingModule { }