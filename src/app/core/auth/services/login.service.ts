import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Navigation } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Messages } from 'src/app/shared/messages/messages.static';
import { environment } from 'src/environments/environment';
import { ChangePasswordModel } from '../interfaces/change-password.interface';
import { ForgotPasswordModel } from '../interfaces/forgot-password.interface';
import { LoginModel } from '../interfaces/login.interface';
import { ResetPasswordModel } from '../interfaces/reset-password.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private storageToken = 'token';
  private storageRefreshToken = 'refreshToken';
  private storageTokenExpiry = 'tokenExpiry';
  private sidebarStateKey = 'sidebarState';
  private rememberMeKey = 'rM';
  private inUse = 'isInUse';
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialog
  ) {}

  storage() {
    const rm = localStorage.getItem(this.rememberMeKey) == 'true';
    return rm ? localStorage : sessionStorage;
  }

  setInUse(inUse: string): void {
    this.storage().setItem(this.inUse, inUse);
  }

  getInUse(): string | null {
    return this.storage().getItem(this.inUse);
  }

  setToken(token: string): void {
    this.storage().setItem(this.storageToken, token);
  }

  getToken(): string | null {
    return this.storage().getItem(this.storageToken);
  }

  setRefreshToken(refreshToken: string): void {
    this.storage().setItem(this.storageRefreshToken, refreshToken);
  }

  getRefreshToken(): string | null {
    return this.storage().getItem(this.storageRefreshToken);
  }

  saveRememberMe(value: boolean) {
    localStorage.setItem(this.rememberMeKey, `${value}`);
  }

  setTokenExpiry(expiryTime: Date): void {
    if (expiryTime) {
      this.storage().setItem(this.storageTokenExpiry, expiryTime.toString());
    }
  }

  getTokenExpiry(): string | null {
    const expiry = this.storage().getItem(this.storageTokenExpiry);
    return expiry || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    const data = this.decodeToken();
    this.dialogRef.closeAll();

    if (data?.Role === Navigation.RoleAdmin) {
      this.router.navigate([Navigation.AdminLogin]);
    } else {
      this.router.navigate(['/']);
    }
    this.storage().removeItem(this.storageToken);
    this.storage().removeItem(this.storageRefreshToken);
    this.storage().removeItem(this.storageTokenExpiry);
    this.storage().removeItem(this.inUse);
    localStorage.removeItem(this.rememberMeKey);
  }

  removeToken(email: string) {
    return this.http.post(
      `${environment.baseURL}UserAuthentication/Logout?email=${email}`,
      null
    );
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
            this.setInUse('true');
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
      `${environment.baseURL}AdminAuthentication/ChangePassword`,
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

  refreshToken(isAdmin = false): Observable<ResponseModel<string>> {
    this.refreshTokenSubject.next(null);

    const refreshToken = this.getRefreshToken();
    const token = this.getToken();
    const tokenExpiry = this.getTokenExpiry();
    let url = `${environment.baseURL}UserAuthentication/RefreshToken`;

    if (!refreshToken || !token || !tokenExpiry) {
      throw new Error(Messages.missingToken);
    }

    const payload = {
      refreshToken: refreshToken,
      accessToken: token,
      refreshTokenExpiryTime: tokenExpiry ?? DateTime.now(),
    };

    if (isAdmin) {
      url = `${environment.baseURL}AdminAuthentication/RefreshToken`;
    }

    return this.http.post<ResponseModel<string>>(url, payload).pipe(
      map((res: any) => {
        if (res.result) {
          this.setToken(res.data.accessToken);
          this.setRefreshToken(res.data.refreshToken);
          this.setTokenExpiry(res.data.refreshTokenExpiryTime);
          this.refreshTokenSubject.next(res.data.accessToken);
        }
        return res;
      })
    );
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
