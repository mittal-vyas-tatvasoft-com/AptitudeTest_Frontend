import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './containers/candidates/candidates.component';
import { ImportCandidateComponent } from './containers/import-candidate/import-candidate.component';
import { EditCandidateComponent } from './containers/edit-candidate/edit-candidate.component';
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
  {
    path: `${Navigation.Edit}/:id`,
    component: EditCandidateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
