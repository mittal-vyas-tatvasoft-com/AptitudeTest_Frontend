import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-import-question',
  templateUrl: './import-question.component.html',
  styleUrls: ['./import-question.component.scss']
})
export class ImportQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(private location: Location) { }

  handleBackBtn() {
    this.location.back();
  }
}
