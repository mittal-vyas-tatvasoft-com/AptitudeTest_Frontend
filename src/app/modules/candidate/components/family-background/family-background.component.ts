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

  getFormData(): FormGroup {
    return this.form;
  }
}
