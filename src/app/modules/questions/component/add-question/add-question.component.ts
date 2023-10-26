import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  editorContent: string = '';
  editorConfig: any = {
    // CKEditor configuration options
  };
  
  constructor(private location: Location) { }

  handleBackBtn() {
    this.location.back();
  }
}
