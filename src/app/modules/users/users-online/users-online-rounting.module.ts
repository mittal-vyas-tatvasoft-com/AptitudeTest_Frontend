import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersOnlineComponent } from './components/users-online/users-online.component';

const routes: Routes = [
  {
    path:'',
    component:UsersOnlineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersOnlineRountingModule { }