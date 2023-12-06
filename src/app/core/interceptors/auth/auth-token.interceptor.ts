import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, tap, throwError, filter, take } from 'rxjs';
import { LoginService } from '../../auth/services/login.service';
import { Navigation, StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { LoaderService } from '../../services/loader.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  refreshTokenObservable: Observable<ResponseModel<string>>;
  private isRefreshing = false;

  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService
  ) { }

  private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      
      const data = this.loginService.decodeToken();

      return this.loginService.refreshToken(data.Role === Navigation.RoleAdmin).pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          if (res.result) {
            return this.retryRequest(req, next);
          } else {
            this.loginService.logout();
            return throwError(Error);
          }
        }),
        catchError((error: any) => {
          this.isRefreshing = false;
          this.loginService.logout();
          throw new Error(error);
        })
      );
    }

    return this.loginService.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => this.retryRequest(req, next))
    );
  }

  retryRequest(req: HttpRequest<any>, next: HttpHandler) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.loginService.getToken()}`,
      },
    });
    return next.handle(newReq);
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // set loader to true 
    if (req.url.toLowerCase().indexOf('/api/') > -1) {
      this.loaderService.setLoading(true, req.url);
    }
    const token = this.loginService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.loaderService.setLoading(false, req.url);
        }
      }),
      catchError((error) => {
        this.loaderService.setLoading(false, req.url);
        if (
          error instanceof HttpErrorResponse &&
          error.status === StatusCode.Unauthorized
        ) {
          return this.handleTokenRefresh(req, next);
        } else {
          throw new Error(error);
        }
      })
    );
  }
}
