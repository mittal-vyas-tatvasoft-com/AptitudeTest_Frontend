export const resetPasswordControl = {
    newPasswordField: {
      value: '',
      key: 'newPassword',
      label: 'New Password',
      required: true,
      requiredErrMsg: 'New Password is required',
    //   patternErrMsg:
    //     'Password length should be 8 characters and it should contain one uppercase, lowercase, special character, and digit.',
      inputType: 'password',
      displayIcon: true,
      iconName: 'visibility',
    },
    confirmPasswordField: {
        value: '',
        key: 'confirmPassword',
        label: 'Confirm Password',
        required: true,
        requiredErrMsg: 'Confirm Password is required',
      //   patternErrMsg:
      //     'Password length should be 8 characters and it should contain one uppercase, lowercase, special character, and digit.',
        inputType: 'password',
        displayIcon: true,
        iconName: 'visibility',
      },
  };
  