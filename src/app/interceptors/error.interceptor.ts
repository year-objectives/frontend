import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        // FIXME: Shouldn't appear in every error. Token related errors must wait retry before presenting
        snackBar.open(error.message, 'close', { duration: 5000 });
      },
    }),
  );
};
