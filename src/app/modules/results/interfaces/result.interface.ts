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
  universityName: string;
  startTime: string;
  points: string;
  pointsColor: string;
  correct: string;
  wrong: string;
  unanswered: string;
  undisplayed: string;
  status: string;
  action: string;
}

export interface ResultData {
  userId: number;
  firstName: string;
  lastName: string;
  collegeName: string;
  startTime: string;
  points: number;
  correctMarks: number;
  correctCount: number;
  wrongMarks: number;
  wrongCount: number;
  unAnsweredCount: number;
  unDisplayedCount: number;
  userTestId: number;
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
