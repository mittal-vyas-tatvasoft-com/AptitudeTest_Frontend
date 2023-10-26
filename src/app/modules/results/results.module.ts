import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultComponent } from './component/result/result.component';
import { ResultDetailsComponent } from './component/result-details/result-details.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';


@NgModule({
  declarations: [
    ResultComponent,
    ResultDetailsComponent
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    SharedMaterialModule
  ]
})
export class ResultsModule { }
