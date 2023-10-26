import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(public dialogRef: MatDialogRef<AddProfileComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }
}
