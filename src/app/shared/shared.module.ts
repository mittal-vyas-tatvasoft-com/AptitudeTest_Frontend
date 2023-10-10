import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './material/shared-material.module';


@NgModule({
  declarations: [],
  imports: [SharedMaterialModule],
  exports: [SharedMaterialModule],
})
export class SharedModule {}