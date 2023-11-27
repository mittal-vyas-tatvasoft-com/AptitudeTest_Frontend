import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { candidateControl } from '../../configs/candidate.configs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { UserData } from '../../interfaces/candidate.interface';

@Component({
  selector: 'app-exam-scores',
  templateUrl: './exam-scores.component.html',
  styleUrls: ['./exam-scores.component.scss'],
})
export class ExamScoresComponent implements OnInit, OnChanges {
  CandidateModel = candidateControl;
  form: FormGroup;
  @Input() candidateData: UserData;

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candidateData'] && this.candidateData) {
      this.form.patchValue(this.candidateData);
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      acpcMeritRank: [''],
      gujcetScore: [''],
      jeeScore: [''],
    });
  }

  getFormData(): FormGroup {
    return this.form;
  }
}
