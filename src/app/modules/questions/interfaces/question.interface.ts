import { Option } from './option.interface';
export interface Question {
  id: number;
  duplicateFromQuestionId: number;
  topicId: number;
  difficulty: number;
  status: boolean;
  questionText: string;
  questionType: number;
  optionType: number;
  options: Option[];
  createdBy?: number;
  updatedBy?: number;
  parentId?: number;
  sequence?: string;
}

export interface Params {
  id?: number;
  isDuplicate?: string;
}

export interface QuestionsCount {
  totalCount: number;
  mathsCount: number;
  reasoningCount: number;
  technicalCount: number;
}
