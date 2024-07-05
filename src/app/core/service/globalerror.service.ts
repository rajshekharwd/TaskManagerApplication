import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService {

  constructor() { }

  handleGlobalError(err: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (err.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `A client-side error occurred: ${err.error.message}`;
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(err);
    }

    return throwError(errorMessage);
  }

  private getServerErrorMessage(err: HttpErrorResponse): string {
    switch (err.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your credentials and try again.';
      case 403:
        return 'You do not have the required permissions.';
      case 404:
        return 'Resource not found. Please check the URL.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Error code: ${err.status}, message: ${err.message}`;
    }
  }
}
