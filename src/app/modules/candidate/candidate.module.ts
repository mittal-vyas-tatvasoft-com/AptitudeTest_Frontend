import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { CandidateRoutingModule } from './candidate-routing.module';
import { EducationDetailsComponent } from './components/education-details/education-details.component';
import { ExamScoresComponent } from './components/exam-scores/exam-scores.component';
import { FamilyBackgroundComponent } from './components/family-background/family-background.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { AddCandidateComponent } from './containers/add-candidate/add-candidate.component';
import { CandidatesComponent } from './containers/candidates/candidates.component';
import { EditCandidateComponent } from './containers/edit-candidate/edit-candidate.component';
import { ImportCandidateComponent } from './containers/import-candidate/import-candidate.component';
import { CandidateService } from './services/candidate.service';

@NgModule({
  declarations: [
    AddCandidateComponent,
    ImportCandidateComponent,
    CandidatesComponent,
    EditCandidateComponent,
    PersonalInfoComponent,
    EducationDetailsComponent,
    ExamScoresComponent,
    FamilyBackgroundComponent,
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    SharedMaterialModule,
    TablesModule,
    ReactiveFormsModule,
    FormControlModule,
  ],
  providers: [CandidateService],
  exports: [EditCandidateComponent],
})
export class CandidateModule {}
