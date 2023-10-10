import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersResultsComponent } from './components/users-results/users-results.component';

const routes: Routes = [
  {
    path:'',
    component:UsersResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersResultsRountingModule { }