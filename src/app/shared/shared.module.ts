import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './material/shared-material.module';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    DeleteConfirmationDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [SharedMaterialModule, CommonModule],
  exports: [
    SharedMaterialModule,
    DeleteConfirmationDialogComponent,
    ConfirmationDialogComponent,
  ],
})
export class SharedModule {}
