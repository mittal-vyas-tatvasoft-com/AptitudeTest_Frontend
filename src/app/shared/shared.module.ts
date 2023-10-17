import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './material/shared-material.module';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    DeleteConfirmationDialogComponent
  ],
  imports: [
    SharedMaterialModule,
    CommonModule
  ],
  exports: [
    SharedMaterialModule,
    DeleteConfirmationDialogComponent
  ],
})
export class SharedModule {}