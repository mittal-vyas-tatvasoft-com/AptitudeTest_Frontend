import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { Navigation, StatusCode } from 'src/app/shared/common/enums';
import { Messages } from 'src/app/shared/messages/messages.static';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { EducationDetailsComponent } from '../../components/education-details/education-details.component';
import { ExamScoresComponent } from '../../components/exam-scores/exam-scores.component';
import { FamilyBackgroundComponent } from '../../components/family-background/family-background.component';
import { PersonalInfoComponent } from '../../components/personal-info/personal-info.component';
import { UpdateParams, UserData } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss'],
})
export class EditCandidateComponent implements OnInit, OnDestroy {
  candidateId: number;
  candidateData: UserData;
  familyDetails: any[];
  academicDetails: any[];
  form: FormGroup;
  isAdmin = false;
  validForm = false;
  disabled: boolean;
  collegeSelectedByCandidate: boolean;
  private ngUnsubscribe$ = new Subject<void>();
  @ViewChild(PersonalInfoComponent)
  personalInfoComponent: PersonalInfoComponent;
  @ViewChild(ExamScoresComponent) examScoresComponent: ExamScoresComponent;
  @ViewChild(FamilyBackgroundComponent)
  familyBackgroundComponent: FamilyBackgroundComponent;
  @ViewChild(EducationDetailsComponent)
  educationDetailsComponent: EducationDetailsComponent;
  @Input() candidateEditMode = false;
  @Input() register = false;
  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private snackbarService: SnackbarService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const userData = this.loginService.decodeToken();
    if (userData) {
      this.isAdmin = userData.Role === Navigation.RoleAdmin;
    }
    this.route.params.subscribe((params) => {
      this.candidateId = +params['id'];
      this.fetchCandidateData(this.candidateId);
    });
  }

  fetchCandidateData(Id: number) {
    if (Number.isNaN(Id)) {
      this.familyDetails = [];
      this.academicDetails = [];
      return;
    }

    this.candidateService
      .getCandidateData(Id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.candidateData = { ...data.data };
        if (this.candidateData.hasOwnProperty('status')) {
          this.candidateData.status = this.candidateData.status ? 1 : 2;
        }
        this.familyDetails = data.data.familyDetails;
        this.academicDetails = data.data.academicsDetails;
        if (this.candidateData.userCollege != null && this.candidateEditMode) {
          this.collegeSelectedByCandidate = true;
        } else {
          this.collegeSelectedByCandidate = false;
        }
      });
  }

  handleBackBtn() {
    this._location.back();
  }

  Save() {
    this.loginService.setProfileEdited('true');
    this.disabled = true;
    const forms = [
      this.personalInfoComponent.getFormData(),
      this.examScoresComponent.getFormData(),
      this.familyBackgroundComponent.getFormData(),
      this.educationDetailsComponent.getFormData(),
    ];
    const personalData = this.personalInfoComponent.getFormData();
    if (forms.every((form) => form.valid)) {
      const [personalInfo, examScores, familyBackground, educationDetail] =
        forms.map((form) => form.value);
      const updateParams: UpdateParams = {
        id: this.candidateId ? this.candidateId : 0,
        firstName: personalData.controls['firstName'].value,
        fatherName: personalData.controls['fatherName'].value,
        lastName: personalData.controls['lastName'].value,
        email: personalData.controls['email'].value,
        phoneNumber: personalData.controls['phoneNumber'].value,
        groupId: personalInfo.userGroup ? personalInfo.userGroup : 0,
        collegeId: personalData.controls['userCollege'].value,
        otherCollege: personalData.controls['otherCollege'].value,
        gender: personalInfo.gender,
        status: personalInfo.status === 1,
        isProfileEdited: !this.isAdmin,
        appliedThrough: personalInfo.appliedThrough,
        technologyInterestedIn: personalInfo.technologyInterestedIn || null,
        pincode: personalInfo.pincode || 0,
        city: personalInfo.cityName,
        permanentAddress1: personalInfo.permanentAddress1,
        permanentAddress2: 'string',
        relationshipWithExistingEmployee: 'string',
        acpcMeritRank: examScores.acpcMeritRank ? examScores.acpcMeritRank : 0,
        gujcetScore: examScores.gujcetScore ? examScores.gujcetScore : 0,
        jeeScore: examScores.jeeScore ? examScores.jeeScore : 0,
        createdBy: 0,
        updatedBy: 0,
        dateOfBirth: personalInfo.dateOfBirth,
        userAcademicsVM: educationDetail.educationDetailsArray
          .filter(
            (educationDetail: { degreeId: string }) =>
              educationDetail.degreeId !== ''
          )
          .map(
            (educationDetail: {
              degreeId: any;
              streamId: any;
              maths: any;
              physics: any;
              university: any;
              grade: any;
            }) => ({
              userid: this.candidateId ? this.candidateId : 0,
              degreeid: educationDetail.degreeId ? educationDetail.degreeId : 0,
              streamid: educationDetail.streamId ? educationDetail.streamId : 0,
              maths: educationDetail.maths ? educationDetail.maths : 0,
              physics: educationDetail.physics ? educationDetail.physics : 0,
              university: educationDetail.university
                ? educationDetail.university
                : null,
              grade: educationDetail.grade ? educationDetail.grade : 0,
              durationfromyear: 0,
              durationfrommonth: 0,
              durationtoyear: 0,
              durationtomonth: 0,
              createdby: 0,
            })
          ),
        userFamilyVM: familyBackground.familyDetailsArray
          .filter(
            (familyDetail: { familyPerson: string }) =>
              familyDetail.familyPerson !== ''
          )
          .map(
            (familyDetail: {
              familyPerson: any;
              qualification: any;
              occupation: any;
            }) => ({
              userid: this.candidateId ? this.candidateId : 0,
              relationshipid: familyDetail.familyPerson,
              qualification: familyDetail.qualification,
              occupation: familyDetail.occupation,
              createdby: 0,
            })
          ),
        state: personalInfo.state || null,
        preferredLocation: personalInfo.preferredLocation,
      };
      if (this.candidateId) {
        this.candidateService
          .updateCandidate(updateParams)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(
            (response) => {
              if (response.statusCode === StatusCode.Success) {
                const isSubmitted = this.loginService.getSubmitted() === 'true';
                if (isSubmitted) {
                  this.router.navigate([`user/${Navigation.Submitted}`]);
                } else {
                  this._location.back();
                }
                this.snackbarService.success(response.message);
              } else {
                this.snackbarService.error(response.message);
                this.disabled = false;
              }
            },
            (error) => {
              this.snackbarService.error(error.statusText);
              this.disabled = false;
            }
          );
      } else {
        this.candidateService
          .registerCandidate(updateParams)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(
            (response) => {
              if (response.statusCode === StatusCode.Success) {
                this.snackbarService.success(response.message);
                this.router.navigate(['']);
              } else {
                this.snackbarService.error(response.message);
                this.disabled = false;
              }
            },
            (error) => {
              this.disabled = false;
              this.snackbarService.error(error.statusText);
            }
          );
      }
    } else {
      this.personalInfoComponent.validateForm();
      this.educationDetailsComponent.validateForm();
      this.examScoresComponent.validateForm();
      window.scroll({ top: 0, behavior: 'smooth' });
      this.snackbarService.error(Messages.fillRequiredField);
      this.disabled = false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
