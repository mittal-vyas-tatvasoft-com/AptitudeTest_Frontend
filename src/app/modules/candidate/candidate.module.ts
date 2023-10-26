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
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: 'https://httpbin.org/post',
   maxFilesize: 50,
   acceptedFiles: 'image/*'
 };

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
    MatDatepickerModule,
    DropzoneModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    CandidateService
  ]
})
export class CandidateModule { }
