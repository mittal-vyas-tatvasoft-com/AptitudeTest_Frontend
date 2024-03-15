import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { validations } from 'src/app/shared/messages/validation.static';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import {
  candidateControl,
  selectOptionsForRelationship,
} from '../../configs/candidate.configs';

export interface excludedRelationship {
  relationshipId: number;
  rowId: number;
}
@Component({
  selector: 'app-family-background',
  templateUrl: './family-background.component.html',
  styleUrls: ['./family-background.component.scss'],
})
export class FamilyBackgroundComponent implements OnInit, OnChanges {
  CandidateModel = candidateControl;
  selectOptionsForRelationship: SelectOption[] = selectOptionsForRelationship;
  filteredOptionsForRelationShip: SelectOption[] = selectOptionsForRelationship;
  form: FormGroup;
  excludedRelationShips: excludedRelationship[] = [
    {
      rowId: -1,
      relationshipId: -1,
    },
  ];

  @Input() familyDetails: any[];

  constructor(
    private formBuilder: FormBuilder,
    public validationService: ValidationService
  ) {}

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

  change(event: any, i: number, data: any) {
    this.filteredOptionsForRelationShip = [];
    this.updateRelationshipDropdown(event, i);
    if (event > 0) {
      data.get('qualification').touched = true;
      data
        .get('qualification')
        .setValidators([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(validations.common.whitespaceREGEX),
        ]);
      data.get('qualification').updateValueAndValidity();
      data.get('occupation').touched = true;
      data
        .get('occupation')
        .setValidators([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(validations.common.whitespaceREGEX),
        ]);
      data.get('occupation').updateValueAndValidity();
    } else {
      data.get('qualification').clearValidators();
      data.get('qualification').updateValueAndValidity();
      data.get('occupation').clearValidators();
      data.get('occupation').updateValueAndValidity();
    }
  }
  updateRelationshipDropdown(event: any, i: number) {
    let relationship = this.excludedRelationShips.find(
      (relation) => relation.rowId === i
    );

    //If dropdown value gets unselected in rows where Mother or father was selected initially
    if (
      !event &&
      (relationship?.relationshipId === 1 || relationship?.relationshipId === 2)
    ) {
      let index = this.excludedRelationShips.indexOf(relationship);
      this.excludedRelationShips.splice(index, 1);
    }
    //If Mother/Father relation is selected first time
    else if (
      (relationship === null || relationship == undefined) &&
      (event === 1 || event === 2)
    ) {
      this.excludedRelationShips.push({
        rowId: i,
        relationshipId: event,
      });
    }
    // If Mother/Father relation is changed from same row
    else if (relationship != null && (event === 1 || event === 2)) {
      relationship.rowId = i;
      relationship.relationshipId = event;
    }
    // If Brother/Sister relation is selected from same row then remove existing excluded relationship for that row
    else if (relationship != null && (event === 3 || event === 4)) {
      let index = this.excludedRelationShips.indexOf(relationship);
      this.excludedRelationShips.splice(index, 1);
    }
    this.selectOptionsForRelationship.forEach((relation) => {
      let existingRelationship = this.excludedRelationShips.find(
        (relationship) => relationship.relationshipId === relation.id
      );
      //Verifying that given relationship is excluded or not
      if (existingRelationship == null) {
        relation.isDisabled = false;
        this.filteredOptionsForRelationShip.push(relation);
      } else {
        relation.isDisabled = true;
        this.filteredOptionsForRelationShip.push(relation);
      }
    });
  }

  getFormData(): FormGroup {
    return this.form;
  }
}
