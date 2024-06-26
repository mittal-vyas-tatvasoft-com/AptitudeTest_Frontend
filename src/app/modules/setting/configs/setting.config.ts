export const SettingControls = {
  register: {
    value: '',
    key: 'userRegistration',
    label: 'Off-Campus Registration',
  },
  camera: {
    value: '',
    key: 'camera',
    label: 'Camera',
  },
  screen: {
    value: '',
    key: 'screenCapture',
    label: 'Take Screenshots',
  },
  clearResponseButton: {
    value: '',
    key: 'clearResponseButton',
    label: 'Clear Response Button',
  },
  Interval: {
    value: '',
    key: 'intervalForScreenCapture',
    label: 'Screenshots Interval (Minutes)',
    requiredErrMsg: 'Interval is required!',
    minLengthErrMsg: 'Minimum interval is 5 minute',
    inputType: 'text',
  },
  CutOff: {
    value: '',
    key: 'cutOff',
    label: 'CutOff Marks',
    requiredErrMsg: 'CutOff is required!',
    inputType: 'text',
  },
  Email: {
    value: '',
    key: 'email',
    label: 'Email',
    required: true,
    requiredErrMsg: 'Email is required',
    patternErrMsg: 'Email is not valid',
    inputType: 'text',
    displayIcon: true,
    iconName: 'person-dark.svg',
  },
  Password: {
    value: '',
    key: 'password',
    label: 'Password/Key',
    required: true,
    requiredErrMsg: 'Password is required',
    inputType: 'password',
    displayIcon: true,
    iconName: 'password-visibility-show-dark.svg',
  },
};
