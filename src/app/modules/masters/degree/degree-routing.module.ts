import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DegreeComponent } from './components/degree/degree.component';

const routes: Routes = [
  {
    path:'',
    component: DegreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DegreeRoutingModule { }
