export const Topics = [
  {
    id: 1,
    name: 'Maths',
  },
  {
    id: 2,
    name: 'Reasoning',
  },
  {
    id: 3,
    name: 'Technical',
  },
];

export const OptionList = ['All', 'Active', 'Inactive'];
export const OptionsIndex = ['A', 'B', 'C', 'D'];
export const Status = [
  { id: 0, name: 'Active', value: true },
  { id: 1, name: 'Inactive', value: false },
];
export const Difficulty = [1, 2, 3, 4, 5];
export const AnswerType = [
  { name: 'Single Answer', value: 1 },
  { name: 'Multi Answer', value: 2 },
];
export const OptionType = [
  { name: 'Text', value: 1 },
  { name: 'Picture', value: 2 },
];

export const MaxImageSize = 100 * 1024;
export const ImageSizeErrorMsg = 'Maximum 100kb allowed';
export const ImageTypeErrorMsg = 'Only png, jpg, jpeg allowed';

export const importQuestionSampleFilePath =
  '/assets/import-sample/Test Question Import Sample.csv';
export const importQuestionSampleFileName = 'Test Question Import Sample.csv';
