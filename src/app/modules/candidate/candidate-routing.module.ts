import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatesComponent } from './component/candidates/candidates.component';
import { ImportCandidateComponent } from './component/import-candidate/import-candidate.component';

const routes: Routes = [
  {
    path: '',
    component: CandidatesComponent
  },
  {
    path: 'admin/import-candidate',
    component: ImportCandidateComponent
    // loadChildren: () =>
    //     import('./candidate.module').then((m) => m.ImportCandidateComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
