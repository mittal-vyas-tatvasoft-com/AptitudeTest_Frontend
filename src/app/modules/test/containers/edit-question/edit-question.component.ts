import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedMarkOption = '1';
  markList: string[] = ['1', '2', '3', '4', '5'];

  constructor(public dialogRef: MatDialogRef<EditQuestionComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }
}
