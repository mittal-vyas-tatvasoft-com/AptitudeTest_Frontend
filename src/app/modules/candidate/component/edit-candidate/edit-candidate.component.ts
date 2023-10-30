import { Component } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss']
})
export class EditCandidateComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(private _location: Location) {}

  handleBackBtn(){
    this._location.back();
  }
}
