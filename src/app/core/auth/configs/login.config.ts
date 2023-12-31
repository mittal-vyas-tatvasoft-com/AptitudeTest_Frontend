export const loginControl = {
  userNameField: {
    value: '',
    key: 'userName',
    label: 'User Name',
    required: true,
    requiredErrMsg: 'User Name is required',
    patternErrMsg: 'User Name is not valid',
    inputType: 'text',
    displayIcon: true,
    iconName: 'person-dark.svg',
  },
  passwordField: {
    value: '',
    key: 'password',
    label: 'Password',
    required: true,
    requiredErrMsg: 'Password is required',
    patternErrMsg:
      'Password length should be 8 characters and it should contain one uppercase, lowercase, special character,and digit.',
    inputType: 'password',
    displayIcon: true,
    iconName: 'password-visibility-show-dark.svg',
  },
};
