import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupComponent } from './component/group/group.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { AddGroupComponent } from './component/add-group/add-group.component';


@NgModule({
  declarations: [
    GroupComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedMaterialModule
  ]
})
export class GroupsModule { }
