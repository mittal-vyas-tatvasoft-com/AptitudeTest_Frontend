import { Component } from '@angular/core';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.scss'],
})
export class McqTestComponent {
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
