import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { SettingService } from './services/setting.service';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting/setting.component';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedMaterialModule,
    FormControlModule,
    ReactiveFormsModule,
  ],
  providers: [SettingService],
})
export class SettingModule {}
