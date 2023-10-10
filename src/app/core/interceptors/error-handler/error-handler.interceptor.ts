import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
    intercept(
      request: HttpRequest<unknown>,
      next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
      return next.handle(request);
    }
}
