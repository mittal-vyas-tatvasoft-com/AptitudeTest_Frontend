import { DateTime } from 'luxon';

export interface createTestModel {
  name: string;
  testDuration: number;
  date: DateTime;
  startTime: Date;
  endTime: Date;
  description: string;
  basicPoint: number;
  status: number;
  messaageAtStartOfTheTest?: string;
  messaageAtEndOfTheTest: string;
  isRandomQuestion: boolean;
  isRandomAnswer: boolean;
  isLogoutWhenTimeExpire: boolean;
  isQuestionsMenu: boolean;
  createdBy: number;
}

export interface testCandidatesModel {
  candidateName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  totalRecords?: number;
  totalPage?: number;
  nextPage?: number;
}

export interface GetAllTestCandidateParams {
  currentPageIndex: number;
  pageSize: number;
  searchQuery: string;
  collegeId: number;
  groupId: number;
  sortField: string;
  sortOrder: string;
}
