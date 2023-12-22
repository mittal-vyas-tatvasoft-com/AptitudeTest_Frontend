export interface CreateTestModel {
  id?: number;
  name: string;
  testDuration: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  negativeMarkingPercentage: number;
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

export interface TestCandidatesModel {
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

export interface TestData {
  id: number;
  testName: string;
  groupName: string;
  testTime: string;
  startTime: string;
  endTime: string;
  noOfCandidates: string;
  status: string;
  totalRecords: number;
  totalPages: number;
  nextPage: number;
}

export interface TestQueryParams {
  currentPageIndex: number;
  pageSize: number;
  searchQuery: string | null;
  groupId: number | null;
  status: number | null;
  date: Date | null;
  sortField: string | null;
  sortOrder: string | null;
}

export interface TopicWiseQuestionData {
  topicId: number;
  totalQuestions: number;
  totalMarks: number;
  singleAnswerCount: number;
  singleAnswer: QuestionTypeCount;
  multiAnswerCount: number;
  multiAnswer: QuestionTypeCount;
}

export interface QuestionTypeCount {
  questionType: number;
  oneMarkQuestion: number;
  twoMarkQuestion: number;
  threeMarkQuestion: number;
  fourMarkQuestion: number;
  fiveMarkQuestion: number;
}

export interface QuestionTopics {
  id: number | string;
  name: string;
  questionCount: number;
}

export interface AllInsertedQuestionModel {
  testId: number;
  totalMarks: number;
  totalQuestions: number;
  questionsCount: TopicWiseQuestionData[];
}

export interface AddTestQuestionModel {
  testId: number;
  topicId: number;
  NoOfQuestions: number;
  weightage: number;
  testQuestionsCount: QuestionTypeCount[];
  createdBy: number;
  updatedBy: number;
}

export interface UpdateTestStatus {
  id: number;
  status: number;
}
