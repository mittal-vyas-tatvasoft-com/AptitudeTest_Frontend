import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnologyComponent } from './components/technology/technology.component';

const routes: Routes = [
  {
    path:'',
    component: TechnologyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TechnologyRoutingModule { }
