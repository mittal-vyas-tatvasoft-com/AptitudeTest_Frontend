import { Component } from '@angular/core';

@Component({
  selector: 'app-import-candidate',
  templateUrl: './import-candidate.component.html',
  styleUrls: ['./import-candidate.component.scss']
})
export class ImportCandidateComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];
}
