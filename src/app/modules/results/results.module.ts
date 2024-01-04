import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultComponent } from './component/result/result.component';
import { ResultDetailsComponent } from './component/result-details/result-details.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { ResultsService } from './services/results.service';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { ResultTableComponent } from './component/result-table/result-table.component';
import { StatisticsTableComponent } from './component/statistics-table/statistics-table.component';
import { AdminApprovalComponent } from './component/admin-approval/admin-approval.component';
import { UpdateTestTimeComponent } from './component/update-test-time/update-test-time.component';

@NgModule({
  declarations: [
    ResultComponent,
    ResultDetailsComponent,
    ResultTableComponent,
    StatisticsTableComponent,
    AdminApprovalComponent,
    UpdateTestTimeComponent,
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    SharedMaterialModule,
    TablesModule,
    ReactiveFormsModule,
    FormControlModule,
  ],
  providers: [ResultsService],
})
export class ResultsModule {}
