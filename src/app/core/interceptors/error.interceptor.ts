import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.error?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
      alert(message);
      return throwError(() => err);
    }),
  );
};
