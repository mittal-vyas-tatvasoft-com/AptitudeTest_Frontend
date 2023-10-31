import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './component/candidates/candidates.component';
import { ImportCandidateComponent } from './component/import-candidate/import-candidate.component';
import { Navigation } from 'src/app/shared/common/enums';

const routes: Routes = [
  {
    path: '',
    component: CandidatesComponent
  },
  {
    path: `${Navigation.ImportCandidate}`,
    component: ImportCandidateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }