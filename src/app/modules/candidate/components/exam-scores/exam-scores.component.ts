import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validations } from 'src/app/shared/messages/validation.static';
import { candidateControl } from '../../configs/candidate.configs';
import { UserData } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';

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
      gujcetScore: ['', [Validators.max(120), Validators.min(0)]],
      jeeScore: ['', [Validators.pattern(validations.common.fractionREGEX)]],
    });
  }

  getFormData(): FormGroup {
    return this.form;
  }
}
