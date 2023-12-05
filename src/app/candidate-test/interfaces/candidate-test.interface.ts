export interface Question {
  id: number;
  difficulty: number;
  questionText: string;
  questionType: number;
  optionType: number;
  nextQuestionId: number;
  questionNumber: number;
  options: string[];
  answers: boolean[];
  totalQuestions: number;
}

export interface QuestionStatusModel {
  questionStatusVMs: QuestionStatusVMs[];
  totalQuestion: number;
  answered: number;
  unAnswered: number;
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
}
