import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { candidateControl, selectOptionsForStream } from '../../configs/candidate.configs';
import { CandidateService } from '../../services/candidate.service';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { Numbers } from 'src/app/shared/common/enums';
import { AcademicsDetail } from '../../interfaces/candidate.interface';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.scss']
})
export class EducationDetailsComponent {
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
  @Input() academicDetails: any[];

  constructor(private formBuilder: FormBuilder, private candidateService: CandidateService,) { }

  ngOnInit() {
    this.getDropdowns();
    this.createForm();
    this.setAcademicsDetails();
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.academicDetails) {
      this.populateForm();
    }

    this.setAcademicsDetails();
  }

  getDropdowns() {
    this.candidateService.getDegreeForDropDown().subscribe((Degrees) => {
      Degrees.forEach((degree) => {
        if (degree.level === Numbers.One) {
          this.degreeSpecialization.push({
            id: degree.id,
            key: degree.name,
            value: degree.name,
          });
        } else if (degree.level === Numbers.Two) {
          this.HSCDiploma.push({
            id: degree.id,
            key: degree.name,
            value: degree.name,
          });
        }
        else if (degree.level === Numbers.Three) {
          this.bachelorDegree.push({
            id: degree.id,
            key: degree.name,
            value: degree.name,
          });
        } else if (degree.level === Numbers.Four) {
          this.masterDegree.push({
            id: degree.id,
            key: degree.name,
            value: degree.name,
          });
        } else if (degree.level === Numbers.Five) {
          this.otherDegree.push({
            id: degree.id,
            key: degree.name,
            value: degree.name,
          });
        }
      });
    });


    this.candidateService.getStremForDropDown().subscribe((Streams) => {
      Streams.forEach((stream) => {
        if (stream.level === Numbers.One) {
          this.streamSpecialization.push({
            id: stream.id,
            key: stream.name,
            value: stream.name,
          });
        } else if (stream.level === Numbers.Two) {
          this.HSCDiplomaStream.push({
            id: stream.id,
            key: stream.name,
            value: stream.name,
          });
        }
        else if (stream.level === Numbers.Three) {
          this.bachelorStream.push({
            id: stream.id,
            key: stream.name,
            value: stream.name,
          });
        } else if (stream.level === Numbers.Four) {
          this.masterStream.push({
            id: stream.id,
            key: stream.name,
            value: stream.name,
          });
        } else if (stream.level === Numbers.Five) {
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
      for (let index = Numbers.Zero; index < this.educationDetailsArray.controls.length; index++) {
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
        const index = this.findFormArrayIndexByDegreeLevel(academicDetail.degreeLevel);
        if (index >= Numbers.Zero && index < this.educationDetailsArray.controls.length) {
          const control = this.educationDetailsArray.controls[index] as FormGroup;

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

    return degreeLevelMapping[level] || Numbers.Zero;
  }

  educationDetailOptions(index: number) {
    switch (index) {
      case Numbers.Zero:
        return this.degreeSpecialization;
      case Numbers.One:
        return this.HSCDiploma;
      case Numbers.Two:
        return this.bachelorDegree;
      case Numbers.Three:
        return this.masterDegree;
      case Numbers.Four:
        return this.otherDegree;
      default:
        return [];
    }
  }

  StreamDetailOptions(index: number) {
    switch (index) {
      case Numbers.Zero:
        return this.streamSpecialization;
      case Numbers.One:
        return this.HSCDiplomaStream;
      case Numbers.Two:
        return this.bachelorStream;
      case Numbers.Three:
        return this.masterStream;
      case Numbers.Four:
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

}
