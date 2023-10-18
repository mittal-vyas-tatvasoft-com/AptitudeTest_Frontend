import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-college',
  templateUrl: './add-college.component.html',
  styleUrls: ['./add-college.component.scss']
})
export class AddCollegeComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(public dialogRef: MatDialogRef<AddCollegeComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }
}
