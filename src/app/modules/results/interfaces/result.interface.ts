import { Pagination } from 'src/app/shared/common/interfaces/pagination.interface';

export interface Results {}

export interface GetResultsParams {
  currentPageIndex: number;
  pageSize: number;
  searchQuery: string;
  collegeId: number;
  groupId: number;
  sortField: string;
  sortOrder: string;
}

export interface ResultModel {
  id: number;
  testId: number;
  name: string;
  number:number;
  universityName: string;
  startTime: string;
  points: string;
  pointsColor: string;
  correct: string;
  wrong: string;
  unanswered: string;
  undisplayed: string;
  timeRemaining: number;
  status: string;
  action: string;
}

export interface ResultData {
  index:number
  userId: number;
  firstName: string;
  fatherName: string;
  lastName: string;
  collegeName: string;
  shortCollegeName: string;
  startTime: string;
  points: number;
  correctMarks: number;
  correctCount: number;
  wrongMarks: number;
  wrongCount: number;
  unAnsweredCount: number;
  unDisplayedCount: number;
  userTestId: number;
  timeRemaining: number;
  status: string;
  totalRecords: number;
  totalPages: number;
  nextPage: number;
}

export interface StatisticsData {
  name: string;
  points: string;
  pointsColor: string;
  correct: string;
  wrong: string;
  unanswered: string;
  undisplayed: string;
}

export interface ResultDetails {
  userId: number;
  name: string;
  allQuestionCount: number;
  allCorrectQuestionCount: number;
  marks1QuestionCount: number;
  marks1CorrectQuestionCount: number;
  marks2QuestionCount: number;
  marks2CorrectQuestionCount: number;
  marks3QuestionCount: number;
  marks3CorrectQuestionCount: number;
  marks4QuestionCount: number;
  marks4CorrectQuestionCount: number;
  marks5QuestionCount: number;
  marks5CorrectQuestionCount: number;
  paginatedData: Pagination<ResultQuestion>;
}

export interface ResultQuestion {
  id: number;
  difficulty: number;
  timeSpentInSeconds: number;
  timeSpent: string;
  questionText: string;
  optionType: number;
  userAnswers: number[];
  options: ResultOptions[];
}

export interface ResultOptions {
  optionId: number;
  optionValue: string;
  isAnswer: boolean;
  isUserAnswer: boolean;
}

export interface ResultDetailsParam {
  id: number;
  testId: number;
  marks: number;
  pagesize: number;
  pageIndex: number;
  onlyCorrect: boolean;
}

export interface StatisticsModel {
  points: number;
  statisticsHeader: string;
  correct: string;
  wrong: string;
  unAnswered: number;
  unDisplayed: number;
}

export interface ResultQueryParam {
  searchQuery: string;
  testId: number;
  groupId: number;
  collegeId: number;
  year?: number;
  sortField: string;
  sortOrder: string;
}

export interface ResultExportData {
  userName: string;
  fullName: string;
  gender: string;
  nameOfCollege: string;
  location: string;
  preferedProfile: string;
  appliedThrough: string;
  permanentAddress: string;
  mobile: string;
  email: string;
  dateOfBirth_Age: string;
  sscUniversity: string;
  sscStream: string;
  sscGrade: string;
  sscMaths: string;
  hscUniversity: string;
  hscStream: string;
  hscGrade: string;
  hscMaths_Account: string;
  hscPhysics_State: string;
  degree1: string;
  degree1University: string;
  degree1Stream: string;
  degree1Grade: string;
  degree2: string;
  degree2University: string;
  degree2Stream: string;
  degree2Grade: string;
  degree3: string;
  degree3University: string;
  degree3Stream: string;
  degree3Grade: string;
  fatherQualification: string;
  fatherOccupation: string;
  motherQualification: string;
  motherOccupation: string;
  brother_Sister1Qualification: string;
  brother_Sister1Occupation: string;
  brother_Sister2Qualificatiostring: string;
  brother_Sister2Occupation: string;
  overallScore: number;
  positiveMarks: number;
  negativeMarks: number;
  totalCorrect: number;
  totalWrong: number;
  totalUnanswered: number;
  mathsTotalCorrect: number;
  mathsTotalWrong: number;
  mathsTotalUnanswered: number;
  mathsCorrectMarks1: number;
  mathsCorrectMarks2: number;
  mathsCorrectMarks3: number;
  mathsCorrectMarks4: number;
  mathsCorrectMarks5: number;
  reasoningTotalCorrect: number;
  reasoningTotalWrong: number;
  reasoningTotalUnanswered: number;
  reasoningCorrectMarks1: number;
  reasoningCorrectMarks2: number;
  reasoningCorrectMarks3: number;
  reasoningCorrectMarks4: number;
  reasoningCorrectMarks5: number;
  technicalTotalCorrect: number;
  technicalTotalWrong: number;
  technicalTotalUnanswered: number;
  technicalCorrectMarks1: number;
  technicalCorrectMarks2: number;
  technicalCorrectMarks3: number;
  technicalCorrectMarks4: number;
  technicalCorrectMarks5: number;
}

export interface ApproveTestParams {
  userId: number;
  testId: number;
}
export interface ApproveTestData {
  userId: number;
  testId: number;
  remainingTimeInMinutes: number;
  duration?: number;
}
