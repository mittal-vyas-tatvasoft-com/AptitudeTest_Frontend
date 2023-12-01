export const CollegeControl = {
  name: {
    value: '',
    key: 'name',
    label: 'Name',
    required: true,
    requiredErrMsg: 'Name is required',
    patternErrMsg: 'Name is not valid',
    inputType: 'text',
    displayIcon: false,
    maxLength: 50,
    maxLengthErrMsg: 'Max 50 characters allowed',
  },
  abbreviation: {
    value: '',
    key: 'abbreviation',
    label: 'Abbreviation',
    required: true,
    requiredErrMsg: 'Abbreviation is required',
    inputType: 'text',
    displayIcon: false,
    maxLength: 10,
    maxLengthErrMsg: 'Max 10 characters allowed',
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
