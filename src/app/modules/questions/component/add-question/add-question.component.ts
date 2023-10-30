import { Location } from '@angular/common';
import { Component } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
  public answerType: string = 'text';
  public message: string = 'Drag & Drop or <span class="link-primary ml-4p">Browse</span>';
  public Editor = ClassicEditor;

  constructor(private location: Location) { }

  // public ckConfig = {
  //   toolbar: {
  //     items: [
  //       'undo', 'redo',
  //       'heading',
  //       'color',
  //       'bold', 'italic', 'underline', 'strikethrough',
  //       'bulletedList', 'numberedList',
  //       'outdent', 'indent',
  //       'imageUpload', 'blockQuote',

  //     ],
  //     shouldNotGroupWhenFull: true
  //   },
  // }

  handleBackBtn() {
    this.location.back();
  }
}
