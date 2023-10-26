import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './component/result/result.component';
import { Navigation } from 'src/app/shared/common/enum';
import { ResultDetailsComponent } from './component/result-details/result-details.component';

const routes: Routes = [
  {
    path: '',
    component: ResultComponent,
  },
  {
    path: `${Navigation.ResultsDetails}`,
    component: ResultDetailsComponent  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
