import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [AddAdminComponent, AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    TablesModule,
    FormControlModule,
  ],
})
export class AdminModule {}
