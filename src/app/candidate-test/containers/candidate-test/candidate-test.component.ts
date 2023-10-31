import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-test',
  templateUrl: './candidate-test.component.html',
  styleUrls: ['./candidate-test.component.scss']
})
export class CandidateTestComponent {
  options = [
    { isChecked: true, optionLetter: 'A' },
    { isChecked: false, optionLetter: 'B' },
    { isChecked: false, optionLetter: 'C' },
    { isChecked: false, optionLetter: 'D' },
  ];

  toggleCheckbox(index: number) {
    this.options[index].isChecked = !this.options[index].isChecked;
  }
}
