import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackBarDuration } from '../common/interfaces/constants.static';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, '', {
      duration: snackBarDuration,
      panelClass: ['success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string) {
    this.snackBar.open(message, '', {
      duration: snackBarDuration,
      panelClass: ['error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
