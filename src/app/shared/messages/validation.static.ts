export const validations = {
  common: {
    emailREGEX: new RegExp(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/),
    passwordREGEX: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/
    ),
    mobileNumberREGEX: new RegExp(/^[6-9]{1}[0-9]{9}$/),
    pinCodeREGEX: new RegExp(/^[1-9]{1}[0-9]{2}[0-9]{3}$/),
    whitespaceREGEX: new RegExp(/^(\s+\S+\s*)*(?!\s).*$/),
    characterWithSpaceREGEX: new RegExp(
      /^[^ ][A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/
    ),
    fractionREGEX: new RegExp(/^[3-9]?[0-9]?(\.[0-9][0-9]?)?$/),
  },
};
