export interface Question {
  id: number;
  difficulty: number;
  questionText: string;
  questionType: number;
  topic: number;
  optionType: number;
  nextQuestionId: number;
  questionNumber: number;
  options: Options[];
  answers: Answer[];
  totalQuestions: number;
}

export interface QuestionStatusModel {
  questionStatusVMs: QuestionStatusVMs[];
  totalQuestion: number;
  answered: number;
  unAnswered: number;
  timeLeft: number;
  isQuestionsMenu: boolean;
}

export interface QuestionStatusVMs {
  questionId: number;
  status: number;
}

export interface SaveAnswerModel {
  userId: number;
  questionId: number;
  timeRemaining: number;
  userAnswers: number[];
  isAttended: boolean;
  timeSpent: number;
}

export interface QuestionTimerDetail {
  userId: number;
  questionId: number;
  timeSpent: number;
}

export interface Options {
  optionId: number;
  optionData: string;
}

export interface Answer {
  optionId: number;
  isAnswer: boolean;
}

export interface TestInstructions {
  messageAtStartOfTheTest: string;
  endTime: string;
  testName: string;
  startTime: string;
  testDate: string;
  testDurationInMinutes: number;
  basicPoints: number;
  negativeMarkingPoints: number;
  timeToStartTest: number;
}

export interface UpdateTestTimeModel {
  userId: number;
  remainingTime: number;
}

export interface UpdateUserTestStatusModel {
  userId: number;
  isActive: boolean;
}

export interface RemainingTime {
  isTimeUpdatedByAdmin: boolean;
  timeRemaining: number;
}
