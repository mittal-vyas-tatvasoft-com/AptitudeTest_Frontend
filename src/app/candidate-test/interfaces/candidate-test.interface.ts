export interface Question {
  id: number;
  difficulty: number;
  questionText: string;
  questionType: number;
  optionType: number;
  nextQuestionId: number;
  questionNumber: number;
  options: string[];
  totalQuestions: number;
}
