import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginErrorService {

  constructor() { }

  handleLoginError(err: HttpErrorResponse) {
    let errorMessage = 'Login failed due to an unknown error. Please try again later.';

    if (err.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Login failed: ${err.error.message}`;
    } else {
      // Server-side error
      errorMessage = this.getLoginServerErrorMessage(err);
    }

    return throwError(errorMessage);
  }

  private getLoginServerErrorMessage(err: HttpErrorResponse): string {
    switch (err.status) {
      case 401:
        return 'Authentication failed. Please check your credentials and try again.';
      default:
        return `Login error code: ${err.status}, message: ${err.message}`;
    }
  }
}
