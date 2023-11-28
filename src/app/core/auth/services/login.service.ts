import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../interfaces/login.interface';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  take,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ForgotPasswordModel } from '../interfaces/forgot-password.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ResetPasswordModel } from '../interfaces/reset-password.interface';
import { HttpClient } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { ChangePasswordModel } from '../interfaces/change-password.interface';
import { Messages } from 'src/app/shared/messages/messages.static';
import { DateTime } from 'luxon';
import { Navigation } from 'src/app/shared/common/enums';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private storageToken = 'token';
  private storageRefreshToken = 'refreshToken';
  private storageTokenExpiry = 'tokenExpiry';
  private sidebarStateKey = 'sidebarState';
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private isRefreshing = false;
  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem(this.storageToken, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageToken);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.storageRefreshToken, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.storageRefreshToken);
  }

  setTokenExpiry(expiryTime: Date): void {
    if (expiryTime) {
      localStorage.setItem(this.storageTokenExpiry, expiryTime.toString());
    }
  }

  getTokenExpiry(): string | null {
    const expiry = localStorage.getItem(this.storageTokenExpiry);
    return expiry ? expiry : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    const data = this.decodeToken();
    if (data.Role == Navigation.RoleAdmin) {
      this.router.navigate([Navigation.AdminLogin]);
    } else {
      this.router.navigate(['/']);
    }
    localStorage.removeItem(this.storageToken);
    localStorage.removeItem(this.storageRefreshToken);
    localStorage.removeItem(this.storageTokenExpiry);
  }

  login(payload: LoginModel): Observable<ResponseModel<string>> {
    return this.http
      .post<ResponseModel<string>>(
        `${environment.baseURL}UserAuthentication/Login`,
        payload
      )
      .pipe(
        map((res: any) => {
          if (res.result) {
            this.setToken(res.data.accessToken);
            this.setRefreshToken(res.data.refreshToken);
            this.setTokenExpiry(res.data.refreshTokenExpiryTime);
          }
          return res;
        })
      );
  }

  Adminlogin(payload: LoginModel): Observable<ResponseModel<string>> {
    return this.http
      .post<ResponseModel<string>>(
        `${environment.baseURL}AdminAuthentication/Login`,
        payload
      )
      .pipe(
        map((res: any) => {
          if (res.result) {
            this.setToken(res.data.accessToken);
            this.setRefreshToken(res.data.refreshToken);
            this.setTokenExpiry(res.data.refreshTokenExpiryTime);
          }
          return res;
        })
      );
  }

  getUserRole(): string {
    const data = this.decodeToken();
    const role = data.Role;
    return role;
  }

  hasAnyRole(allowedRoles: string[]): boolean {
    const userRoles = this.getUserRole();
    return allowedRoles.some((role) => userRoles.includes(role));
  }

  forgotPassword(
    userName: ForgotPasswordModel
  ): Observable<ResponseModel<string>> {
    const url = `${environment.baseURL}UserAuthentication/ForgetPassword?email=${userName.Email}`;
    return this.http.post<ResponseModel<string>>(url, null);
  }

  resetPassword(
    payload: ResetPasswordModel
  ): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}UserAuthentication/ResetPassword`,
      payload
    );
  }

  changePassword(
    payload: ChangePasswordModel
  ): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}UserAuthentication/ChangePassword`,
      payload
    );
  }

  saveStateToLocalStorage(state: boolean) {
    localStorage.setItem(this.sidebarStateKey, JSON.stringify(state));
  }

  getStateFromLocalStorage(): boolean {
    const storedState = localStorage.getItem(this.sidebarStateKey);
    return storedState ? JSON.parse(storedState) : true;
  }

  refreshTokenAdmin(): Observable<ResponseModel<string>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.getRefreshToken();
      const token = this.getToken();
      const tokenExpiry = this.getTokenExpiry();

      if (!refreshToken || !token || !tokenExpiry) {
        this.isRefreshing = false;
        return throwError(new Error(Messages.missingToken));
      }

      const payload = {
        refreshToken: refreshToken,
        accessToken: token,
        refreshTokenExpiryTime:
          tokenExpiry != null ? tokenExpiry : DateTime.now(),
      };
      return this.http
        .post<ResponseModel<string>>(
          `${environment.baseURL}AdminAuthentication/RefreshToken`,
          payload
        )
        .pipe(
          map((res: any) => {
            if (res.result) {
              this.setToken(res.data.accessToken);
              this.setRefreshToken(res.data.refreshToken);
              this.setTokenExpiry(res.data.refreshTokenExpiryTime);
            }
            return res;
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1)
      );
    }
  }

  refreshToken(): Observable<ResponseModel<string>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.getRefreshToken();
      const token = this.getToken();
      const tokenExpiry = this.getTokenExpiry();

      if (!refreshToken || !token || !tokenExpiry) {
        this.isRefreshing = false;
        return throwError(new Error(Messages.missingToken));
      }

      const payload = {
        refreshToken: refreshToken,
        accessToken: token,
        refreshTokenExpiryTime:
          tokenExpiry != null ? tokenExpiry : DateTime.now(),
      };
      return this.http
        .post<ResponseModel<string>>(
          `${environment.baseURL}UserAuthentication/RefreshToken`,
          payload
        )
        .pipe(
          map((res: any) => {
            if (res.result) {
              this.setToken(res.data.accessToken);
              this.setRefreshToken(res.data.refreshToken);
              this.setTokenExpiry(res.data.refreshTokenExpiryTime);
            }
            return res;
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1)
      );
    }
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
