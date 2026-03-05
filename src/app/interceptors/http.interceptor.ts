import { HttpInterceptorFn } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Interceptor] Request made to: ${req.url}`);
  
  return next(req).pipe(
    tap(event => {
      // Log successful responses if needed
    }),
    catchError(error => {
      console.error('[HTTP Interceptor] HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
