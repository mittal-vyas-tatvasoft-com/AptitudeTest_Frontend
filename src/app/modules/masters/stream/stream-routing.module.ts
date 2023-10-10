import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreamComponent } from './components/stream/stream.component';

const routes: Routes = [
  {
    path:'',
    component: StreamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StreamRoutingModule { }
