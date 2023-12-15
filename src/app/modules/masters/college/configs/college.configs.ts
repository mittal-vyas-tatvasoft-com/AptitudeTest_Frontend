export const CollegeControl = {
  name: {
    value: '',
    key: 'name',
    label: 'Name',
    required: true,
    requiredErrMsg: 'Name is required',
    inputType: 'text',
    displayIcon: false,
    maxLength: 50,
    maxLengthErrMsg: 'Max 50 characters allowed',
    patternErrMsg: 'White space is not applicable',
  },
  abbreviation: {
    value: '',
    key: 'abbreviation',
    label: 'Abbreviation',
    required: true,
    requiredErrMsg: 'Abbreviation is required',
    patternErrMsg: 'White space is not applicable',
    inputType: 'text',
    displayIcon: false,
    maxLengthErrMsg: 'Max 10 characters allowed',
    minLengthErrMsg: 'Min 2 characters required',
  },
  status: {
    value: '',
    key: 'status',
    label: 'Status',
    requiredErrMsg: 'Status is required!',
  },
};

export const selectOptionsForStatus = [
  {
    id: 1,
    key: 'Active',
    value: 'Active',
  },
  {
    id: 2,
    key: 'Inactive',
    value: 'Inactive',
  },
];
