export const QuestionControls = {
  topicId: {
    value: '',
    key: 'topicId',
    label: 'Topic',
    required: true,
    requiredErrMsg: 'Topic is required',
  },
  difficulty: {
    value: '',
    key: 'difficulty',
    label: 'Difficulty',
    required: true,
    requiredErrMsg: 'Difficulty is required',
  },
  status: {
    value: true,
    key: 'status',
    label: 'Status',
    requiredErrMsg: 'Status  is required',
  },
  questionText: {
    value: '',
    key: 'questionText',
    label: 'QuestionText',
    required: true,
    requiredErrMsg: 'QuestionText is required',
  },
  questionType: {
    value: '',
    key: 'questionType',
    label: 'AnswerType',
    required: true,
    requiredErrMsg: 'AnswerType is required',
  },
  optionType: {
    value: '',
    key: 'optionType',
    label: 'OptionType',
    required: true,
    requiredErrMsg: 'OptionType is required',
  },
  optionValue: {
    value: '',
    key: 'optionValue',
    label: 'OptionValue',
    required: true,
    requiredErrMsg: 'Option Value is required',
  },
  optionValueA: {
    value: '',
    key: 'optionValueA',
    label: 'OptionValue',
    required: true,
    requiredErrMsg: 'Option Value is required',
  },
  optionValueB: {
    value: '',
    key: 'optionValueB',
    label: 'OptionValue',
    required: true,
    requiredErrMsg: 'Option Value is required',
  },
  optionValueC: {
    value: '',
    key: 'optionValueC',
    label: 'OptionValue',
    required: true,
    requiredErrMsg: 'Option Value is required',
  },
  optionValueD: {
    value: '',
    key: 'optionValueD',
    label: 'OptionValue',
    required: true,
    requiredErrMsg: 'Option Value is required',
  },
  optionImage: {
    value: '',
    key: 'optionImage',
    label: 'OptionImage',
    required: true,
    requiredErrMsg: 'Option Images are required',
  },
  isAnswer: {
    value: '',
    key: 'isAnswer',
    label: 'isAnswer',
    required: true,
    invalidErrorMsg: 'Please select correct answers',
  },
};

export const DragDropInput =
  'Drag & Drop or <span class="link-primary ml-4p">Browse</span>';
export const dropzoneConfig = {
  acceptedFiles: '.png,.jpg,.jpeg', // Accepted file types (e.g., images)
  addRemoveLinks: true, // Show remove links for uploaded files
  maxFiles: 1,
  maxFilesize: 0.09765625, // file size in mb equivalent to 100kb
};
export const dropzoneConfigCsv = {
  acceptedFiles: '.csv', // Accepted file types (e.g., images)
  addRemoveLinks: true, // Show remove links for uploaded files
  maxFiles: 1,
};
