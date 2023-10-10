import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../interfaces/login.interface';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ForgotPasswordModel } from '../interfaces/forgot-password.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ResetPasswordModel } from '../interfaces/reset-password.interface';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  storageToken = 'token';
  constructor(private router: Router) {}

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
    localStorage.removeItem(this.storageToken);
    this.router.navigate(['/']);
  }

  login(loginData: LoginModel): Observable<ResponseModel<string>> {
    if (loginData.username === 'user' && loginData.password === 'password') {
      this.setToken(loginData.username);
      return of({ 
        result: true,
        statusCode: 200,
        message: 'Login successful',
        data: 'Success'
       });
    } else {
      return of({ 
        result: false,
        statusCode: 400,
        message: 'Login Failed',
        data: 'Failed'
       });
    }
  }

  forgotPassword(data: ForgotPasswordModel): Observable<ResponseModel<string>> {
    if (data.userName === 'test@gmail.com' ){
      return of({ 
        result: true,
        statusCode: 200,
        message: 'Password reset successful',
        data: 'Success'
       });
    }
    else {
      return of({ 
        result: false,
        statusCode: 400,
        message: 'Password reset Failed',
        data: 'Failed'
       });
    }
  }

  resetPassword(data: ResetPasswordModel): Observable<ResponseModel<string>> {
    return of({ 
      result: true,
      statusCode: 200,
      message: 'Password reset successful',
      data: 'Success'
     });
  }

  
}
