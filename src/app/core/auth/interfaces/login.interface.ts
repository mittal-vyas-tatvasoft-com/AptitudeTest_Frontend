import { DateTime } from 'luxon';

export interface LoginModel {
  email: string;
  password: string;
}

export interface TokenWithSidVm {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: DateTime;
  sid: string;
  isSubmitted: boolean;
  isProfileEdited: boolean;
}
