import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { AddCandidateComponent } from './component/add-candidate/add-candidate.component';
import { ImportCandidateComponent } from './component/import-candidate/import-candidate.component';
import { CandidateService } from './services/candidate.service';
import { CandidatesComponent } from './component/candidates/candidates.component';
import { EditCandidateComponent } from './component/edit-candidate/edit-candidate.component';
import { AddGroupComponent } from './component/add-group/add-group.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { FormControlModule } from "../../shared/modules/form-control/form-control.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddCandidateComponent,
    ImportCandidateComponent,
    CandidatesComponent,
    EditCandidateComponent,
    AddGroupComponent
  ],
  providers: [
    CandidateService,
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    SharedMaterialModule,
    TablesModule,
    FormControlModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CandidateModule { }
