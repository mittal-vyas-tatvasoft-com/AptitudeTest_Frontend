import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { AddProfileComponent } from './components/add-profile/add-profile.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { ProfileRountingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from 'src/app/shared/modules/tables/tables.module';

@NgModule({
  declarations: [AddProfileComponent, ProfileComponent],
  imports: [
    CommonModule,
    ProfileRountingModule,
    CoreModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TablesModule,
  ],
})
export class ProfileModule {}
