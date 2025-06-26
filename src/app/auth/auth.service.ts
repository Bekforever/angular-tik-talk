import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  access_token: string | null = null;
  refresh_token: string | null = null;

  get isAuth() {
    if (!this.access_token) {
      this.access_token = this.cookieService.get('token');
      this.refresh_token = this.cookieService.get('refreshToken');
    }
    return !!this.access_token;
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData();
    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}token`, fd)
      .pipe(tap((res) => this.saveTokens(res)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}refresh`, {
        refresh_token: this.refresh_token,
      })
      .pipe(
        tap((res) => this.saveTokens(res)),
        catchError((error) => {
          this.logout();
          return throwError(() => new Error(error));
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.access_token = null;
    this.refresh_token = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponse) {
    this.access_token = res.access_token;
    this.refresh_token = res.refresh_token;

    this.cookieService.set('token', this.access_token);
    this.cookieService.set('refreshToken', this.refresh_token);
  }
}
