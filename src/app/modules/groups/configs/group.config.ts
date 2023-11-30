export const GroupFormControls = {
  name: {
    value: '',
    key: 'name',
    label: 'Group Name',
    requiredErrMsg: 'Group name is required',
    maxLengthErrMsg: 'Max 35 characters allowed',
    inputType: 'text',
    maxLength: 35,
  },
  default: {
    value: false,
    key: 'default',
    label: 'Set as Default Group',
  },
};
