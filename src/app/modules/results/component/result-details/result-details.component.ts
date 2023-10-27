import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent {
  constructor(private _location: Location) {}
  handleBackBtn(){
    this._location.back();
  }
}
