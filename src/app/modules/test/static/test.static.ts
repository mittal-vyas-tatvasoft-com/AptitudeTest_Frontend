import {
  QuestionTopics,
  QuestionTypeCount,
} from '../interfaces/test.interface';

export const Topics: QuestionTopics[] = [
  {
    id: '',
    name: 'Select',
    questionCount: 0,
  },
  {
    id: 1,
    name: 'Maths',
    questionCount: 0,
  },
  {
    id: 2,
    name: 'Reasoning',
    questionCount: 0,
  },
  {
    id: 3,
    name: 'Technical',
    questionCount: 0,
  },
];

export const QuestionCountInitial: QuestionTypeCount = {
  questionType: 0,
  oneMarkQuestion: 0,
  twoMarkQuestion: 0,
  threeMarkQuestion: 0,
  fourMarkQuestion: 0,
  fiveMarkQuestion: 0,
};

export const CanNotAddMoreQuestions: string =
  "All marks are occupied you can't add more questions";
export const SelectValidQuestionCount: string =
  'Please select valid number of questions';

export const MarksAvailable: number[] = [1, 2, 3, 4, 5];
