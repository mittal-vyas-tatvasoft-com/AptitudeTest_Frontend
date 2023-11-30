import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import {
  candidateControl,
  selectOptionsForRelationship,
} from '../../configs/candidate.configs';

@Component({
  selector: 'app-family-background',
  templateUrl: './family-background.component.html',
  styleUrls: ['./family-background.component.scss'],
})
export class FamilyBackgroundComponent implements OnInit, OnChanges {
  CandidateModel = candidateControl;
  selectOptionsForRelationship: SelectOption[] = selectOptionsForRelationship;
  form: FormGroup;
  @Input() familyDetails: any[];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['familyDetails'] && !changes['familyDetails'].firstChange) {
      this.populateForm();
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      familyDetailsArray: this.formBuilder.array([]),
    });
  }

  get familyDetailsArray() {
    return this.form.get('familyDetailsArray') as FormArray;
  }

  populateForm() {
    while (this.familyDetailsArray.length !== 0) {
      this.familyDetailsArray.removeAt(0);
    }

    if (this.familyDetails) {
      for (let i = 0; i < 5; i++) {
        const familyDetail = this.familyDetails[i] || {};
        this.familyDetailsArray.push(
          this.formBuilder.group({
            familyPerson: new FormControl(familyDetail.familyPerson || ''),
            qualification: new FormControl(familyDetail.qualification || ''),
            occupation: new FormControl(familyDetail.occupation || ''),
          })
        );
      }
    }
  }

  getFormData(): FormGroup {
    return this.form;
  }
}
