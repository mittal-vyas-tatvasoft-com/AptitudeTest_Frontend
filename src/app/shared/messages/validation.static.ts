export const validations = {
  common: {
    emailREGEX: new RegExp(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/),
    passwordREGEX: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/
    ),
    mobileNumberREGEX: new RegExp(/^[6-9]{1}[0-9]{9}$/),
    pinCodeREGEX: new RegExp(/^[1-9]{1}[0-9]{2}[0-9]{3}$/),
  },
};
