import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { CandidateService } from './services/candidate.service';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { EditCandidateComponent } from './containers/edit-candidate/edit-candidate.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { EducationDetailsComponent } from './components/education-details/education-details.component';
import { ExamScoresComponent } from './components/exam-scores/exam-scores.component';
import { FamilyBackgroundComponent } from './components/family-background/family-background.component';
import { AddCandidateComponent } from './containers/add-candidate/add-candidate.component';
import { CandidatesComponent } from './containers/candidates/candidates.component';
import { ImportCandidateComponent } from './containers/import-candidate/import-candidate.component';


@NgModule({
  declarations: [
    AddCandidateComponent,
    ImportCandidateComponent,
    CandidatesComponent,
    EditCandidateComponent,
    PersonalInfoComponent,
    EducationDetailsComponent,
    ExamScoresComponent,
    FamilyBackgroundComponent
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
