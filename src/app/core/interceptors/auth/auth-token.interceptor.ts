import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, takeUntil, throwError } from 'rxjs';
import { LoginService } from '../../auth/services/login.service';
import { Navigation, StatusCode } from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { Messages } from 'src/app/shared/messages/messages.static';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  refreshTokenObservable: Observable<ResponseModel<string>>;

  constructor(
    private loginService: LoginService,
    public snackbar: SnackbarService
  ) { }

  private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const data = this.loginService.decodeToken();
    if (data.Role === Navigation.RoleAdmin) {
      this.refreshTokenObservable = this.loginService.refreshTokenAdmin();
    } else {
      this.refreshTokenObservable = this.loginService.refreshToken();
    }
    return this.refreshTokenObservable.pipe(
      switchMap((res: any) => {
        if (res.result) {
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${this.loginService.getToken()}`,
            },
          });
          return next.handle(newReq);
        } else {
          this.loginService.logout();
          return throwError(Error);
        }
      }),
      catchError((error: any) => {
        this.loginService.logout();
        return throwError(error);
      })
    );
  }

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
        if (
          error instanceof HttpErrorResponse &&
          error.status === StatusCode.Unauthorized
        ) {
          return this.handleTokenRefresh(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }
}
