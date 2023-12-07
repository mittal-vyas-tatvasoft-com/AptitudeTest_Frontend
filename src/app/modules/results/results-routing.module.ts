import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './component/result/result.component';
import { ResultDetailsComponent } from './component/result-details/result-details.component';
import { Navigation } from 'src/app/shared/common/enums';

const routes: Routes = [
  {
    path: '',
    component: ResultComponent,
  },
  {
    path: `${Navigation.ResultsDetails}`,
    component: ResultDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultsRoutingModule {}
