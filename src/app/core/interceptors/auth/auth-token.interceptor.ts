import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../../auth/services/login.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.loginService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token is invalid or expired, try refreshing the token
          return this.loginService.refreshToken().pipe(
            switchMap((result) => {
              if (result.result) {
                // Retry the original request with the new token
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${this.loginService.getToken()}`,
                  },
                });
                return next.handle(req);
              } else {
                // Refresh token failed, perform logout
                this.loginService.logout();
                return throwError('Token refresh failed.');
              }
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
