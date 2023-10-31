import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent {
  constructor(public dialogRef: MatDialogRef<AddGroupComponent>) { }
  closeModal() {
    this.dialogRef.close();
  }
}
