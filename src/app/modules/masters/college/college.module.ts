import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeComponent } from './components/college/college.component';
import { AddCollegeComponent } from './components/add-college/add-college.component';
import { CollegeRountingModule } from './college-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';



@NgModule({
  declarations: [
    AddCollegeComponent,
    CollegeComponent
  ],
  imports: [
    CommonModule,
    CollegeRountingModule,
    CoreModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    TablesModule,
    FormControlModule
  ]
})
export class CollegeModule { }
