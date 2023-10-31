import { Component } from '@angular/core';


@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss']
})
export class EditCandidateComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

}
