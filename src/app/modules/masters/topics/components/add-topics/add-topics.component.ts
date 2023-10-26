import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-topics',
  templateUrl: './add-topics.component.html',
  styleUrls: ['./add-topics.component.scss']
})
export class AddTopicsComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(public dialogRef: MatDialogRef<AddTopicsComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }
}
