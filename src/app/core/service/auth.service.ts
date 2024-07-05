import { afterNextRender, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiEndPoint } from '../../shared/apiendpoint/api-endPoint';
import { loginInterface } from '../interface/login.interface';
import { catchError, Observable } from 'rxjs';
import { GlobalErrorService } from './globalerror.service';
import { Router } from '@angular/router';
import { LoginErrorService } from './login-error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.loginbaseURL;
  apikey: string = environment.apikey;

  constructor(
    private http: HttpClient,
    private globalErrorService: GlobalErrorService,
    private loginErrorService:LoginErrorService,
    private router:Router
  ) {}

  login(email: string, password: string): Observable<loginInterface> {
    return this.http.post<loginInterface>(`${this.baseUrl}${apiEndPoint.login}${this.apikey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError((error: HttpErrorResponse) =>{
          if (error.status === 401) {
            return this.loginErrorService.handleLoginError(error);
          } else {
            return this.globalErrorService.handleGlobalError(error);
          }
      })
    );
  }

  setAuthToken(res: loginInterface): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('Token', JSON.stringify(res.idToken));
      localStorage.setItem('registered', JSON.stringify(res.registered));
    } else {
      console.error('localStorage is not available.');
    }
  }

  getAuthToken(): string | null {
    const tokenString = localStorage.getItem('Token');
    return tokenString ? JSON.parse(tokenString) : null;
  }
  authRegistered(): string | null {
    const registered = localStorage.getItem('registered');
    return registered ? JSON.parse(registered) : null;
  }

  removeAuthToken(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('registered');
  }

}
