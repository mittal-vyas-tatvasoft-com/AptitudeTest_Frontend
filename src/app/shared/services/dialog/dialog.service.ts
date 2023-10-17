import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../common/interfaces/dialogdata.interface';



@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openModel(component: any, data: DialogData, hasBackdrop = true) {
    let dialogRef = undefined;
    if (this.dialog.openDialogs.length < 2) {
      dialogRef = this.dialog.open(component, {
        width: data.width,
        hasBackdrop: hasBackdrop,
        panelClass: data.panelClass,
        data: data,
        autoFocus: false,
        backdropClass: data.backdropClass,
        disableClose: data.disableClose ? data.disableClose : undefined,
        maxWidth: data.maxWidth,
      });
    }
    return dialogRef;
  }
}
