import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-rounting.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MastersRoutingModule,
    SharedModule,
    SharedMaterialModule,
  ]
})
export class MastersModule { }