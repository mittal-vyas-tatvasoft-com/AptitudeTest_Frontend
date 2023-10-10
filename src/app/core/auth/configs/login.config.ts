export const loginControl = {
    userNameField: {
      value: '',
      key: 'userName',
      label: 'User Name',
      required: true,
      requiredErrMsg: 'User name is required',
    //   patternErrMsg: 'User name is not valid',
      inputType: 'text',
      displayIcon: true,
      iconName: 'person',
    },
    passwordField: {
      value: '',
      key: 'password',
      label: 'Password',
      required: true,
      requiredErrMsg: 'Password is required',
    //   patternErrMsg:
        // 'Password length should be 8 characters and it should contain one uppercase, lowercase, special character, and digit.',
      inputType: 'password',
      displayIcon: true,
      iconName: 'visibility',
    },
}