import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { QuestionsService } from '../../services/questions.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AnswerType,
  Difficulty,
  ImageSizeErrorMsg,
  ImageTypeErrorMsg,
  MaxImageSize,
  OptionsIndex,
  Status,
  Topics,
} from '../../static/question.static';
import {
  DragDropInput,
  QuestionControls,
  dropzoneConfig,
} from '../../configs/question.config';
import { ValidationService } from 'src/app/shared/modules/form-control/services/validation.service';
import {
  OptionType,
  QuestionType,
  StatusCode,
} from 'src/app/shared/common/enums';
import { Question } from 'src/app/modules/questions/interfaces/question.interface';
import { environment } from 'src/environments/environment';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent implements OnInit {
  public message: string = DragDropInput;
  public Editor = ClassicEditor;
  dropzoneConfig = dropzoneConfig;
  questionId: number = 0;
  questionForm: FormGroup;
  topics = Topics;
  difficulty = Difficulty;
  status = Status;
  answerType = AnswerType;
  optionsIndex = OptionsIndex;
  questionControls = QuestionControls;
  optionTypes = OptionType;
  checkboxValues: number[] = [];
  isAnswer: boolean[] = [false, false, false, false];
  optionImageFlag: boolean[] = [false, false, false, false];
  optionImageTouched: boolean[] = [false, false, false, false];
  previewImages: string[] = ['', '', '', ''];
  uploadImages: any[] = [null, null, null, null];
  optionIds: number[] = [0, 0, 0, 0];
  formData: FormData;
  isDuplicate: boolean;
  question: Question;
  isEdit: boolean = false;
  baseImageUrl = environment.baseURL.slice(0, -4) + 'Files/';
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private fb: FormBuilder,
    public validation: ValidationService,
    public snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.questionId = param.id;
        this.isDuplicate = param.isDuplicate === 'true';
        this.isEdit = !this.isDuplicate;
        this.questionService.get(param.id).subscribe((data: any) => {
          this.question = data.data;
          this.setFormValues();
        });
      }
    });

    this.questionForm
      .get('questionType')
      ?.valueChanges.subscribe((data: any) => {
        if (this.isEdit || this.isDuplicate) {
          this.questionForm.get('isAnswer')?.markAsTouched();
        }
      });

    this.questionForm.get('optionType')?.valueChanges.subscribe((data: any) => {
      if (data == this.optionTypes.Image) {
        this.removeOptionValidators();
      } else {
        this.setOptionValidators();
      }
    });
  }

  handleBackBtn() {
    this.location.back();
  }

  handleCancelBtn() {
    this.location.back();
  }

  setOptionValidators() {
    for (let i = 0; i < 4; i++) {
      this.questionForm
        .get('optionValue' + this.optionsIndex[i])
        ?.setValidators([Validators.required]);
      this.questionForm
        .get('optionValue' + this.optionsIndex[i])
        ?.updateValueAndValidity();
    }
  }

  removeOptionValidators() {
    for (let i = 0; i < 4; i++) {
      this.questionForm
        .get('optionValue' + this.optionsIndex[i])
        ?.setValidators([]);
      this.questionForm
        .get('optionValue' + this.optionsIndex[i])
        ?.updateValueAndValidity();
    }
  }
  createForm() {
    this.questionForm = this.fb.group({
      topicId: ['', Validators.required],
      difficulty: ['', Validators.required],
      status: [true, Validators.required],
      questionText: ['', Validators.required],
      questionType: ['', Validators.required],
      optionType: [1, Validators.required],
      optionValueA: ['', Validators.required],
      optionValueB: ['', Validators.required],
      optionValueC: ['', Validators.required],
      optionValueD: ['', Validators.required],
      isAnswer: ['', Validators.required],
    });
  }

  setFormValues() {
    this.questionId = this.question.id;
    for (let i = 0; i < 4; i++) {
      this.optionIds[i] = this.question.options[i].optionId;
      this.isAnswer[i] = this.question.options[i].isAnswer;
      if (this.question.optionType == this.optionTypes.Image) {
        this.previewImages[i] =
          this.baseImageUrl + this.question.options[i].optionValue!;
        this.optionImageFlag[i] = true;
      }
      if (this.question.options[i].isAnswer == true) {
        this.checkboxValues.push(i);
      }
    }

    if (this.question.optionType == this.optionTypes.Text) {
      this.questionForm.setValue({
        topicId: this.question.topicId,
        difficulty: this.question.difficulty,
        status: this.question.status,
        questionText: this.question.questionText,
        questionType: this.question.questionType,
        optionType: this.question.optionType,
        optionValueA: this.question.options[0].optionValue,
        optionValueB: this.question.options[1].optionValue,
        optionValueC: this.question.options[2].optionValue,
        optionValueD: this.question.options[3].optionValue,
        isAnswer: this.isAnswer,
      });
    } else {
      this.questionForm.setValue({
        topicId: this.question.topicId,
        difficulty: this.question.difficulty,
        status: this.question.status,
        questionText: this.question.questionText,
        questionType: this.question.questionType,
        optionType: this.question.optionType,
        optionValueA: '',
        optionValueB: '',
        optionValueC: '',
        optionValueD: '',
        isAnswer: this.isAnswer,
      });
    }
  }

  get options() {
    return this.questionForm.controls['optionValue'] as FormArray;
  }

  get optionType() {
    return this.questionForm.get('optionType')?.value;
  }

  onImageUpload(event: any, index: number) {
    this.previewImages[index] = event[0].dataURL;
    this.optionImageFlag[index] = true;
    this.optionImageTouched[index] = true;
    this.uploadImages[index] = event[0];
  }

  onImageUploadError(event: any) {
    if (event[0].size > MaxImageSize) {
      this.snackbarService.error(ImageSizeErrorMsg);
      return;
    } else {
      this.snackbarService.error(ImageTypeErrorMsg);
    }
  }

  addQuestion() {
    if (
      this.questionForm.valid &&
      this.areAnswersValid() &&
      this.areImagesValid()
    ) {
      this.formData = this.createFormData();
      if (this.isEdit) {
        this.questionService.update(this.formData).subscribe({
          next: (res: any) => {
            if (res.statusCode == StatusCode.Success) {
              this.snackbarService.success(res.message);
              this.router.navigate(['admin/questions']);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
      } else {
        this.questionService.create(this.formData).subscribe({
          next: (res: any) => {
            if (res.statusCode == StatusCode.Success) {
              this.snackbarService.success(res.message);
              this.router.navigate(['admin/questions']);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
      }
    } else {
      this.questionForm.markAllAsTouched();
      this.questionForm.get('isAnswer')?.markAsTouched();
      this.optionImageTouched = [true, true, true, true];
    }
  }

  checkboxChanged(event: any) {
    this.questionForm.get('isAnswer')?.markAsTouched();
    if (event.checked) {
      this.isAnswer[Number(event.source.value)] = true;
      this.checkboxValues.push(Number(event.source.value));
    } else {
      this.isAnswer[Number(event.source.value)] = false;
      const index = this.checkboxValues.indexOf(Number(event.source.value));
      this.checkboxValues.splice(index, 1);
    }
    this.questionForm.get('isAnswer')?.setValue(this.checkboxValues);
    if (this.checkboxValues.length == 0) {
      this.questionForm.get('isAnswer')?.setValue('');
    }
  }

  getCheckboxError() {
    let questionType = this.questionForm.get('questionType')?.value;
    let isAnswer = this.questionForm.get('isAnswer');
    if (
      questionType == QuestionType.SingleAnswer &&
      this.checkboxValues.length != 1 &&
      isAnswer?.touched
    ) {
      return this.questionControls.isAnswer.invalidErrorMsg;
    }
    if (
      this.questionForm.get('questionType')?.value ==
        QuestionType.MultiAnswer &&
      isAnswer?.touched &&
      (this.checkboxValues.length < 2 || this.checkboxValues.length > 4)
    ) {
      return this.questionControls.isAnswer.invalidErrorMsg;
    }
    return null;
  }

  getImageError() {
    if (
      this.optionImageTouched.indexOf(false) == -1 &&
      this.optionImageFlag.indexOf(false) > -1
    ) {
      return this.questionControls.optionImage.requiredErrMsg;
    }
    return null;
  }

  removeImage(index: number) {
    this.optionImageFlag[index] = false;
  }

  areAnswersValid() {
    let questionType = this.questionForm.get('questionType')?.value;
    if (
      (questionType == QuestionType.MultiAnswer &&
        (this.checkboxValues.length < 2 || this.checkboxValues.length > 4)) ||
      (questionType == QuestionType.SingleAnswer &&
        this.checkboxValues.length != 1)
    ) {
      return false;
    }
    return true;
  }

  areImagesValid() {
    if (
      this.optionTypes.Image == this.optionType &&
      this.optionImageFlag.indexOf(false) > -1
    ) {
      return false;
    }
    return true;
  }

  isValid() {
    return (
      this.questionForm.valid && this.areAnswersValid() && this.areImagesValid()
    );
  }

  createFormData() {
    let data = new FormData();
    data.append('Id', !this.isEdit ? '0' : this.questionId.toString());
    data.append('TopicId', this.questionForm.get('topicId')?.value);
    data.append('QuestionText', this.questionForm.get('questionText')?.value);
    data.append('Difficulty', this.questionForm.get('difficulty')?.value);
    data.append('QuestionType', this.questionForm.get('questionType')?.value);
    data.append('OptionType', this.questionForm.get('optionType')?.value);
    data.append('Status', this.questionForm.get('status')?.value);
    if (this.isDuplicate) {
      data.append('duplicateFromQuestionId', this.questionId.toString());
    }

    for (let i = 0; i < 4; i++) {
      data.append('Options[' + i + '].optionId', this.optionIds[i].toString());
      if (this.optionType == OptionType.Text) {
        data.append(
          'Options[' + i + '].OptionValue',
          this.questionForm.get('optionValue' + this.optionsIndex[i])?.value
        );
      } else {
        data.append('Options[' + i + '].optionImage', this.uploadImages[i]);
      }
      data.append('Options[' + i + '].IsAnswer', this.isAnswer[i].toString());
    }

    return data;
  }

  getOptionTextError(index: number) {
    let option = 'optionValue' + this.optionsIndex[index];
    if (
      (this.questionForm.get(option)?.dirty ||
        this.questionForm.get(option)?.touched) &&
      !this.questionForm.get(option)?.valid
    ) {
      return this.questionControls.optionValue.requiredErrMsg;
    }
    return null;
  }
}
