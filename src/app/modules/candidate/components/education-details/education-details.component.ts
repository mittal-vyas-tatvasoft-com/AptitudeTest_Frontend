import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import {
  ErrorMessageForEductionDetail,
  MinMaxValue,
  candidateControl,
  labelNameForCollege,
  labelNameForDegree,
  selectOptionsForStream,
} from '../../configs/candidate.configs';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.scss'],
})
export class EducationDetailsComponent
  implements OnInit, AfterViewInit, OnChanges
{
  CandidateModel = candidateControl;
  form: FormGroup;
  selectOptionsForStream: SelectOption[] = selectOptionsForStream;
  degreeSpecialization: SelectOption[] = [];
  HSCDiploma: SelectOption[] = [];
  bachelorDegree: SelectOption[] = [];
  masterDegree: SelectOption[] = [];
  otherDegree: SelectOption[] = [];
  streamSpecialization: SelectOption[] = [];
  HSCDiplomaStream: SelectOption[] = [];
  bachelorStream: SelectOption[] = [];
  masterStream: SelectOption[] = [];
  otherStream: SelectOption[] = [];
  labelNameForDegree: string[] = labelNameForDegree;
  labelNameForCollege: string[] = labelNameForCollege;
  ErrorMessage = ErrorMessageForEductionDetail;
  MinMaxValue = MinMaxValue;
  @Input() academicDetails: any[];
  @Input() isAdmin: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.getDropdowns();
    this.setAcademicsDetails();
    this.populateForm();
  }

  ngOnChanges() {
    if (this.academicDetails) {
      this.populateForm();
    }
    this.setAcademicsDetails();
  }

  getDropdowns() {
    this.candidateService
      .getDegreeForDropDown(this.isAdmin)
      .subscribe((Degrees) => {
        Degrees.forEach((degree) => {
          if (degree.level === 1) {
            this.degreeSpecialization.push({
              id: degree.id,
              key: degree.name,
              value: degree.name,
            });
          } else if (degree.level === 2) {
            this.HSCDiploma.push({
              id: degree.id,
              key: degree.name,
              value: degree.name,
            });
          } else if (degree.level === 3) {
            this.bachelorDegree.push({
              id: degree.id,
              key: degree.name,
              value: degree.name,
            });
          } else if (degree.level === 4) {
            this.masterDegree.push({
              id: degree.id,
              key: degree.name,
              value: degree.name,
            });
          } else if (degree.level === 5) {
            this.otherDegree.push({
              id: degree.id,
              key: degree.name,
              value: degree.name,
            });
          }
        });
      });

    this.candidateService
      .getStremForDropDown(this.isAdmin)
      .subscribe((Streams) => {
        Streams.forEach((stream) => {
          if (stream.level === 1) {
            this.streamSpecialization.push({
              id: stream.id,
              key: stream.name,
              value: stream.name,
            });
          } else if (stream.level === 2) {
            this.HSCDiplomaStream.push({
              id: stream.id,
              key: stream.name,
              value: stream.name,
            });
          } else if (stream.level === 3) {
            this.bachelorStream.push({
              id: stream.id,
              key: stream.name,
              value: stream.name,
            });
          } else if (stream.level === 4) {
            this.masterStream.push({
              id: stream.id,
              key: stream.name,
              value: stream.name,
            });
          } else if (stream.level === 5) {
            this.otherStream.push({
              id: stream.id,
              key: stream.name,
              value: stream.name,
            });
          }
        });
      });
  }

  getFormData(): FormGroup {
    return this.form;
  }

  setAcademicsDetails() {
    if (this.academicDetails) {
      const academicDetails = this.academicDetails;
      for (
        let index = 0;
        index < this.educationDetailsArray.controls.length;
        index++
      ) {
        const control = this.educationDetailsArray.controls[index] as FormGroup;
        control.patchValue({
          degreeId: '',
          university: '',
          streamId: '',
          grade: '',
          maths: '',
          physics: '',
        });
      }
      academicDetails.forEach((academicDetail: any) => {
        const index = this.findFormArrayIndexByDegreeLevel(
          academicDetail.degreeLevel
        );
        if (index >= 0 && index < this.educationDetailsArray.controls.length) {
          const control = this.educationDetailsArray.controls[
            index
          ] as FormGroup;

          control.patchValue({
            degreeId: academicDetail.degreeId,
            university: academicDetail.university,
            streamId: academicDetail.streamId,
            grade: academicDetail.grade,
            maths: academicDetail.maths,
            physics: academicDetail.physics,
          });
        }
      });
    }
  }

  private findFormArrayIndexByDegreeLevel(level: number): number {
    const degreeLevelMapping: { [key: number]: number } = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
    };
    return degreeLevelMapping[level] || 0;
  }

  educationDetailOptions(index: number) {
    switch (index) {
      case 0:
        return this.degreeSpecialization;
      case 1:
        return this.HSCDiploma;
      case 2:
        return this.bachelorDegree;
      case 3:
        return this.masterDegree;
      case 4:
        return this.otherDegree;
      default:
        return [];
    }
  }

  StreamDetailOptions(index: number) {
    switch (index) {
      case 0:
        return this.streamSpecialization;
      case 1:
        return this.HSCDiplomaStream;
      case 2:
        return this.bachelorStream;
      case 3:
        return this.masterStream;
      case 4:
        return this.otherStream;
      default:
        return [];
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      educationDetailsArray: this.formBuilder.array([]),
    });
  }

  get educationDetailsArray() {
    return this.form.get('educationDetailsArray') as FormArray;
  }

  populateForm() {
    for (let i = 0; i < 5; i++) {
      const academicDetail = this.academicDetails[i];
      this.educationDetailsArray.push(
        this.formBuilder.group({
          degreeId: academicDetail?.degreeId || '',
          university: academicDetail?.university || '',
          streamId: academicDetail?.streamId || '',
          grade: academicDetail?.grade || '',
          maths: academicDetail?.maths || '',
          physics: academicDetail?.physics || '',
        })
      );
    }
  }

  isInvalid(control: AbstractControl): boolean {
    return control instanceof FormControl && control.invalid && control.touched;
  }

  validateForm() {
    for (let i = 0; i < 3; i++) {
      const control = this.educationDetailsArray.at(i) as FormGroup | null;
      if (control) {
        Object.keys(control.controls).forEach((key) => {
          const formControl = control.get(key) as FormControl;
          if (formControl) {
            formControl.markAsTouched();
            formControl.setValidators(Validators.required);
            formControl.updateValueAndValidity();
          }
        });
      }
    }
  }

  getError(formControlName: AbstractControl<any, any> | null) {
    if (formControlName == null || formControlName?.errors == null) {
      return '';
    } else {
      if (formControlName?.errors!['required'] && formControlName?.touched) {
        return this.ErrorMessage.Percentage;
      } else if (formControlName?.errors!['min'] && formControlName?.touched) {
        return this.ErrorMessage.Min;
      } else if (formControlName?.errors!['max'] && formControlName?.touched) {
        return this.ErrorMessage.Max;
      }
      return '';
    }
  }
}
