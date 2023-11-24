import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { PersonalInfoComponent } from '../../components/personal-info/personal-info.component';
import { ExamScoresComponent } from '../../components/exam-scores/exam-scores.component';
import { FamilyBackgroundComponent } from '../../components/family-background/family-background.component';
import * as moment from 'moment';
import { AcademicsDetail, CombinedData, FamilyDetail, UpdateParams, UserData } from '../../interfaces/candidate.interface';
import { EducationDetailsComponent } from '../../components/education-details/education-details.component';
import { FormGroup } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';




@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss']
})
export class EditCandidateComponent {
  candidateId: number;
  candidateData: UserData;
  familyDetails: any[];
  academicDetails: any[];
  form: FormGroup;
  @ViewChild(PersonalInfoComponent) personalInfoComponent: PersonalInfoComponent;
  @ViewChild(ExamScoresComponent) examScoresComponent: ExamScoresComponent;
  @ViewChild(FamilyBackgroundComponent) familyBackgroundComponent: FamilyBackgroundComponent;
  @ViewChild(EducationDetailsComponent) educationDetailsComponent: EducationDetailsComponent;

  constructor(private _location: Location,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private snackbarService: SnackbarService,) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.candidateId = +params['id'];
      this.fetchCandidateData(this.candidateId);
    });
  }

  fetchCandidateData(Id: number) {
    this.candidateService.getCandidateData(Id).subscribe((data) => {
      this.candidateData = { ...data.data };
      if (this.candidateData.hasOwnProperty('status')) {
        this.candidateData.status = this.candidateData.status ? 1 : 2;
      }
      this.familyDetails = data.data.familyDetails;
      this.academicDetails = data.data.academicsDetails
    });
  }

  handleBackBtn() {
    this._location.back();
  }

  Save() {
    const forms = [
      this.personalInfoComponent.getFormData(),
      this.examScoresComponent.getFormData(),
      this.familyBackgroundComponent.getFormData(),
      this.educationDetailsComponent.getFormData(),
    ];
    if (forms.every(form => form.valid)) {
      const [personalInfo, examScores, familyBackground, educationDetail] = forms.map(form => form.value);
      const combinedData = {
        personalInfo,
        examScores,
        familyBackground,
        educationDetail,
      };
      const updateParams: UpdateParams = {
        id: this.candidateId,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        fatherName: personalInfo.fatherName,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
        groupId: personalInfo.userGroup,
        collegeId: personalInfo.userCollege,
        gender: personalInfo.gender,
        status: personalInfo.status === 1 ? true : false,
        appliedThrough: personalInfo.appliedThrough,
        technologyInterestedIn: personalInfo.technologyInterestedIn || null,
        pincode: personalInfo.pincode,
        city: personalInfo.cityName,
        permanentAddress1: personalInfo.permanentAddress1,
        permanentAddress2: 'string',
        relationshipWithExistingEmployee: 'string',
        acpcMeritRank: examScores.acpcMeritRank,
        gujcetScore: examScores.gujcetScore,
        jeeScore: examScores.jeeScore,
        createdBy: 0,
        updatedBy: 0,
        dateOfBirth: personalInfo.dateOfBirth,
        userAcademicsVM: educationDetail.educationDetailsArray
          .filter((educationDetail: { degreeId: string; }) => educationDetail.degreeId !== '')
          .map((educationDetail: { degreeId: any; streamId: any; maths: any; physics: any; university: any; grade: any; }) => ({
            userid: this.candidateId,
            degreeid: educationDetail.degreeId ? educationDetail.degreeId : 0,
            streamid: educationDetail.streamId || null,
            maths: educationDetail.maths ? educationDetail.maths : 0,
            physics: educationDetail.physics ? educationDetail.physics : 0,
            university: educationDetail.university ? educationDetail.university : null,
            grade: educationDetail.grade ? educationDetail.grade : 0,
            durationfromyear: 0,
            durationfrommonth: 0,
            durationtoyear: 0,
            durationtomonth: 0,
            createdby: 0,
          })),
        userFamilyVM: familyBackground.familyDetailsArray
          .filter((familyDetail: { familyPerson: string; }) => familyDetail.familyPerson !== '')
          .map((familyDetail: { familyPerson: any; qualification: any; occupation: any; }) => ({
            userid: this.candidateId,
            relationshipid: familyDetail.familyPerson,
            qualification: familyDetail.qualification,
            occupation: familyDetail.occupation,
            createdby: 0,
          })),
        state: personalInfo.state || null,
      };

      this.candidateService.updateCandidate(updateParams).subscribe(
        (response) => {
          this.snackbarService.success(response.message);
          this._location.back();
        },
        (error) => {
          this.snackbarService.error(error.message);
        }
      );
    } else {
      this.personalInfoComponent.validateForm();
      this.educationDetailsComponent.validateForm();
    }
  }
}
