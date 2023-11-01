import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { AdminRountingModule } from './admin-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';

@NgModule({
  declarations: [AddAdminComponent, AdminComponent],
  imports: [
    CommonModule,
    AdminRountingModule,
    CoreModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    TablesModule,
    FormControlModule,
  ],
})
export class AdminModule {}
