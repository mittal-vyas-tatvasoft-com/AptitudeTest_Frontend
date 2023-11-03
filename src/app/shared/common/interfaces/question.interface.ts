import { Option } from '../../modules/form-control/interfaces/option';
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
}
