import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDegreeComponent } from './components/add-degree/add-degree.component';
import { DegreeComponent } from './components/degree/degree.component';
import { DegreeRoutingModule } from './degree-routing.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddDegreeComponent, DegreeComponent],
  imports: [
    CommonModule,
    DegreeRoutingModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DegreeModule {}
