export const validations = {
  common: {
    emailREGEX: new RegExp(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/),
    passwordREGEX: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
    mobileNumberREGEX: new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/),
  },
};
