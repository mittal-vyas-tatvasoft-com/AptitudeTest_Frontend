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
import { LoginModel, TokenWithSidVm } from '../interfaces/login.interface';
import { ResetPasswordModel } from '../interfaces/reset-password.interface';
import { CandidateTestService } from 'src/app/candidate-test/services/candidate-test.service';
import { UpdateTestTimeModel } from 'src/app/candidate-test/interfaces/candidate-test.interface';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private storageToken = 'token';
  private storageRefreshToken = 'refreshToken';
  private storageTokenExpiry = 'tokenExpiry';
  private sidebarStateKey = 'sidebarState';
  private rememberMeKey = 'rM';
  private submitted = 'submitted';
  private profileSaved = 'saved';
  private sId = 'sId';
  public remainingExamTimeInSeconds: number;
  isUpdateTime = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialog,
    private candidateTestService: CandidateTestService,
    private location: Location,
  ) {}

  storage() {
    const rm = localStorage.getItem(this.rememberMeKey) == 'true';
    return rm ? localStorage : sessionStorage;
  }

  setToken(token: string): void {
    this.storage().setItem(this.storageToken, token);
  }

  getToken(): string | null {
    return this.storage().getItem(this.storageToken);
  }

  setSubmitted(submitted: string): void {
    this.storage().setItem(this.submitted, submitted);
  }

  getSubmitted(): string | null {
    return this.storage().getItem(this.submitted);
  }

  setSid(token: string): void {
    this.storage().setItem(this.sId, token);
  }

  getSid(): string | null {
    return this.storage().getItem(this.sId);
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
    if (data !== null && data.Role == Navigation.RoleAdmin) {
      this.router.navigate([Navigation.AdminLogin]);
    } else {
      let timeData: UpdateTestTimeModel = {
        userId: Number(data.Id),
        remainingTime: this.remainingExamTimeInSeconds,
      };
      if (this.isUpdateTime) {
        this.candidateTestService.updateTime(timeData).subscribe();
      }
      this.candidateTestService
        .updateUserTestStatus({ isActive: false, userId: Number(data.Id) })
        .subscribe();
      this.router.navigate(['/']);
    }
    this.storage().removeItem(this.storageToken);
    this.storage().removeItem(this.storageRefreshToken);
    this.storage().removeItem(this.storageTokenExpiry);
    this.storage().removeItem(this.sId);
    this.storage().removeItem(this.submitted);
    this.storage().removeItem(this.profileSaved);
    localStorage.removeItem(this.rememberMeKey);
  }

  login(payload: LoginModel): Observable<ResponseModel<TokenWithSidVm>> {
    return this.http
      .post<ResponseModel<TokenWithSidVm>>(
        `${environment.baseURL}UserAuthentication/Login`,
        payload
      )
      .pipe(
        map((res: any) => {
          if (res.result) {
            this.setToken(res.data.accessToken);
            this.setRefreshToken(res.data.refreshToken);
            this.setTokenExpiry(res.data.refreshTokenExpiryTime);
            this.setSid(res.data.sid);
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

  changeUserPassword(
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

  checkProfileSaved() {
    const isProfileSaved = this.getProfileEdited() === 'true';
    if (isProfileSaved) {
      this.router.navigate([`user/${Navigation.Submitted}`]);
    }
  }

  checkProfileNotSaved() {
    const isProfileSaved = this.getProfileEdited() === 'true';
    if (!isProfileSaved) {
      const token = this.decodeToken();
      this.router.navigate([`${Navigation.Edit}/${token.Id}`]);
    }
  }

  checkTestSubmitted() {
    const isSubmitted = this.getSubmitted() === 'true';
    if (isSubmitted) {
      this.router.navigate([`user/${Navigation.Submitted}`]);
    }
  }

  setProfileEdited(edited: string): void {
    this.storage().setItem(this.profileSaved, edited);
  }

  getProfileEdited(): string | null {
    return this.storage().getItem(this.profileSaved);
  }
}
