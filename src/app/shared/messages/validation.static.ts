export const validations = {
  common: {
    emailREGEX: new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    passwordREGEX: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/
    ),
    mobileNumberREGEX: new RegExp(/^[0-9]{10}$/),
    pinCodeREGEX: new RegExp(/^[1-9]{1}[0-9]{2}[0-9]{3}$/),
    whitespaceREGEX: new RegExp(/^(\s+\S+\s*)*(?!\s).*$/),
    characterWithSpaceREGEX: new RegExp(/^[a-zA-Z]+$/),
    fractionREGEX: new RegExp(/^[0-9]?[0-9]?(\.[0-9][0-9]?)?$/),
  },
};
