import { DateTime } from 'luxon';

export interface LoginModel {
  email: string;
  password: string;
}

export interface TokenWithSidVm {
  id: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: DateTime;
  sid: string;
  isSubmitted: boolean;
  isProfileEdited: boolean;
  isStarted: boolean;
  isFirstLoggedIn: boolean;
}
