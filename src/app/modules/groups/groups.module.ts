import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { AddGroupComponent } from './containers/add-group/add-group.component';
import { GroupComponent } from './containers/group/group.component';
import { GroupCardComponent } from './components/group-card/group-card.component';


@NgModule({
  declarations: [
    AddGroupComponent,
    GroupComponent,
    GroupCardComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
