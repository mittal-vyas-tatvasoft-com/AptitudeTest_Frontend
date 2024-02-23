import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './material/shared-material.module';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { PreventContextMenuDirective } from './directives/prevent-context-menu.directive';
import { CoreModule } from '../core/core.module';
import { AuthModule } from '../core/auth/auth.module';

@NgModule({
  declarations: [
    DeleteConfirmationDialogComponent,
    ConfirmationDialogComponent,
    PreventContextMenuDirective,
  ],
  imports: [SharedMaterialModule, CommonModule],
  exports: [
    SharedMaterialModule,
    DeleteConfirmationDialogComponent,
    ConfirmationDialogComponent,
    PreventContextMenuDirective,
  ],
})
export class SharedModule {}
