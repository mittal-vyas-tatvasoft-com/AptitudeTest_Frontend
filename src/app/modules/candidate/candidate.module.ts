import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { AddCandidateComponent } from './component/add-candidate/add-candidate.component';
import { ImportCandidateComponent } from './component/import-candidate/import-candidate.component';
import { CandidateService } from './services/candidate.service';
import { CandidatesComponent } from './component/candidates/candidates.component';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';


@NgModule({
  declarations: [
    AddCandidateComponent,
    ImportCandidateComponent,
    CandidatesComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    SharedMaterialModule,
    TablesModule
  ],
  providers: [
    CandidateService,
  ]
})
export class CandidateModule { }
