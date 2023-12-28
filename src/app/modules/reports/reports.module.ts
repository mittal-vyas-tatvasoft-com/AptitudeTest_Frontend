import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { ViewScreenshotsComponent } from './containers/view-screenshots/view-screenshots.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';

@NgModule({
  declarations: [
    ViewScreenshotsComponent,
    FileExplorerComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedMaterialModule,
    TablesModule,
    ReactiveFormsModule,
    FormControlModule,
  ],
  exports: [],
})
export class ReportsModule {}
