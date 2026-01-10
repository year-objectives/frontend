import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { UserRegisterRequestDto } from '../dtos/user-register-request-dto';
import { UserLoginRequestDto } from '../dtos/user-login-request-dto';
import { ApiService } from 'src/app/api.service';

interface UserLoginResponseDto {
  auth_token: string;
  refresh_token_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authUrl = '/authentication';
  private apiService: ApiService = inject(ApiService);
  private _token = signal<string>('');

  public getToken(): string {
    return this._token();
  }

  login(userLoginData: UserLoginRequestDto) {
    return this.apiService
      .post<UserLoginResponseDto>(`${this.authUrl}/login`, userLoginData)
      .pipe(
        tap((response) => {
          if (response.auth_token) {
            this._token.set(response.auth_token);
          }
        }),
      );
  }

  createAccount(userRegisterData: UserRegisterRequestDto) {
    return this.apiService.post<any>(
      `${this.authUrl}/register`,
      userRegisterData,
    );
  }

  refreshToken() {
    return this.apiService
      .post<any>(`${this.authUrl}/refresh-token`, null)
      .pipe(
        tap((response) => {
          this._token.set(response.auth_token ?? '');
        }),
      );
  }

  logout() {
    return this.apiService.post(`${this.authUrl}/logout`, null);
  }
}
