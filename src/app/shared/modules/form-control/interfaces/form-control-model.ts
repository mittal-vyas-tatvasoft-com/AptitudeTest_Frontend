export interface FormControlModel {
  value: string | boolean;
  key: string;
  label: string;
  requiredErrMsg?: string;
  patternErrMsg?: string;
  maxLengthErrMsg?: string;
  minLengthErrMsg?: string;
  inputType?: string;
  displayIcon?: boolean;
  iconName?: string;
  accept?: string[];
  maxLength?: number;
  maxErrMsg?: string;
  minErrMsg?: string;
}
