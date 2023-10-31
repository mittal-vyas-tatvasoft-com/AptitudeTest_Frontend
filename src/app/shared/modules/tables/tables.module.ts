import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { SharedModule } from '../../shared.module';
import { FormControlModule } from '../form-control/form-control.module';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    TableComponent
  ],
  exports: [TableComponent],
  imports: [
    CommonModule,
    SharedMaterialModule,
    FormsModule,
    FormControlModule,
    SharedModule,
  ],
})
export class TablesModule {}