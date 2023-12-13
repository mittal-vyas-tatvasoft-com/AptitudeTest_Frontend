import { NumberInput } from '@angular/cdk/coercion';
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

export interface ResultData {
  id?: number;
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
