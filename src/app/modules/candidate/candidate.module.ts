import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { AddCandidateComponent } from './component/add-candidate/add-candidate.component';
import { CandidateService } from './services/candidate.service';
import { CandidatesComponent } from './component/candidates/candidates.component';
import { ImportCandidateComponent } from './component/import-candidate/import-candidate.component';
import { EditCandidateComponent } from './component/edit-candidate/edit-candidate.component';
import { AddGroupComponent } from './component/add-group/add-group.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    AddCandidateComponent,
    ImportCandidateComponent,
    CandidatesComponent,
    EditCandidateComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    SharedMaterialModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [
    CandidateService,
  ]
})
export class CandidateModule { }
