import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { GroupsRoutingModule } from './groups-routing.module';
import { AddGroupComponent } from './containers/add-group/add-group.component';
import { GroupComponent } from './containers/group/group.component';
import { GroupCardComponent } from './components/group-card/group-card.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from '../../shared/modules/form-control/form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddGroupComponent, GroupComponent, GroupCardComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    CoreModule,
    SharedMaterialModule,
    FormControlModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class GroupsModule {}
