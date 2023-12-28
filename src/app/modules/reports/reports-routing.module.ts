import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewScreenshotsComponent } from './containers/view-screenshots/view-screenshots.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'screenshots',
    pathMatch: 'full',
  },
  {
    path: 'screenshots',
    component: ViewScreenshotsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
