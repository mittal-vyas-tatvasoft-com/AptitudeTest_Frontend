import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-register',
  templateUrl: './candidate-register.component.html',
  styleUrls: ['./candidate-register.component.scss']
})
export class CandidateRegisterComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

}
