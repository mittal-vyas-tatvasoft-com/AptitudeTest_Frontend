export const GroupFormControls = {
  name: {
    value: '',
    key: 'name',
    label: 'Group Name',
    requiredErrMsg: 'Group name is required',
    maxLengthErrMsg: 'Max 500 characters allowed',
    inputType: 'text',
    maxLength: 500,
  },
  default: {
    value: false,
    key: 'default',
    label: 'Set as Default Group',
  },
};
