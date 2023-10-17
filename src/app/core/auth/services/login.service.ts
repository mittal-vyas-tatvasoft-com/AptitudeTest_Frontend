import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../interfaces/login.interface';
import { Observable, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ForgotPasswordModel } from '../interfaces/forgot-password.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ResetPasswordModel } from '../interfaces/reset-password.interface';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  storageToken = 'token';
  constructor(private http: HttpClient,private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem(this.storageToken, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageToken);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    console.log("this.storageToken",this.storageToken)
    localStorage.removeItem(this.storageToken);
    this.router.navigate(['/']);
  }

  // login(payload: LoginModel): Observable<ResponseModel<string>> {
  //   return this.http
  //   .post<ResponseModel<string>>(`${environment.baseURL}UserAuthentication/Login`, payload)
  //   .pipe(
  //     map((res: any) => {
  //       if (res.result) {
  //         console.log(res.result)
  //         this.setToken(res.data.accessToken);
  //       }
  //       return res;
  //     }),
  //   );
  // }


  forgotPassword(
    userName: ForgotPasswordModel,
  ): Observable<ResponseModel<string>> {
    const url = `${environment.baseURL}UserAuthentication/ForgetPassword?email=${userName.Email}`;
    return this.http.post<ResponseModel<string>>(url,null);
  }

  resetPassword(
    payload: ResetPasswordModel,
  ): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}UserAuthentication/ResetPassword`,
      payload,
    );
  }

  
}
