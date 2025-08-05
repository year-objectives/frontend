import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpClient: HttpClient = inject(HttpClient);

  login(email: string, password: string) {
    return this.httpClient
      .post<any>('/api/v1/users', null, {
        headers: {
          'Content-Type': 'application/json',
          'x-user': email,
          'x-password': password,
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

  createAccount(name: string, email: string, password: string) {
    return this.httpClient
      .post<any>('/api/v1/users', null, {
        headers: {
          'Content-Type': 'application/json',
          'x-name': name,
          'x-user': email,
          'x-password': password,
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
