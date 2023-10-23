import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  constructor(public dialogRef: MatDialogRef<AddCandidateComponent>) { }
  closeModal() {
    this.dialogRef.close();
  }

}
