import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpClient: HttpClient = inject(HttpClient);

  login(data: LoginData) {
    return this.httpClient
      .post<any>('/api/v1/users', null, {
        headers: {
          'Content-Type': 'application/json',
          'x-user': data.email,
          'x-password': data.password,
          credentials: 'include',
        },
      })
      .pipe(
        tap((response) => {
          if (response.id) {
            sessionStorage.setItem('currentUserId', response.id);
            sessionStorage.setItem('currentUserName', response.name);
          }
        }),
      );
  }

  createAccount(data: SignUpData) {
    return this.httpClient
      .post<any>('/api/v1/users', null, {
        headers: {
          'Content-Type': 'application/json',
          'x-name': data.name,
          'x-user': data.email,
          'x-password': data.password,
          credentials: 'include',
        },
      })
      .pipe(
        tap((response) => {
          if (response.id) {
            sessionStorage.setItem('currentUserId', response.id);
            sessionStorage.setItem('currentUserName', response.name);
          }
        }),
      );
  }
}
