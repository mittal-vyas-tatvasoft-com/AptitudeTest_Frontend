import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  filter,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Navigation, StaticMessages, StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { LoginService } from '../../auth/services/login.service';
import { LoaderService } from '../../services/loader.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  refreshTokenObservable: Observable<ResponseModel<string>>;
  private isRefreshing = false;

  constructor(
    private loginService: LoginService,
    private snackbarService: SnackbarService,
    private loaderService: LoaderService
  ) { }

  private handleTokenRefresh(
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      const data = this.loginService.decodeToken();
      if (data === null) {
        this.loginService.logout();
      }
      return this.loginService
        .refreshToken(data.Role === Navigation.RoleAdmin)
        .subscribe((res) => {
          this.isRefreshing = false;
          if (res.result) {
            return this.retryRequest(req, next);
          } else {
            this.loginService.logout();
            return throwError(Error);
          }
        }, (err: any) => {
          this.isRefreshing = false;
          this.loginService.logout();
          console.log(err);
        })
    }

    return this.loginService.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => this.retryRequest(req, next))
    );
  }

  retryRequest(req: HttpRequest<any>, next: HttpHandler) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.loginService.getToken()}`,
        Xid: this.loginService.getSid() || '',
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
          Xid: this.loginService.getSid() || '',
        },
      });
    }
    return next.handle(req).pipe(
      tap((res) => {
        if (res instanceof HttpResponse) {
          this.loaderService.setLoading(false, req.url);
        }
      }, err => {
        this.loaderService.setLoading(false, req.url);
        if (
          err instanceof HttpErrorResponse &&
          err.status === StatusCode.AlreadyLoggedIn
        ) {
          this.snackbarService.error(StaticMessages.AlreadyLoggedInError);
          this.loginService.logout();
          throw new Error();
        }
        if (
          err instanceof HttpErrorResponse &&
          err.status === StatusCode.Unauthorized
        ) {
          return this.handleTokenRefresh(req, next);
        } else {
          throw new Error(err);
        }
      }),
    );
  }
}
