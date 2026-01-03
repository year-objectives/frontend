import { Component, inject, signal } from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import {
  AuthenticationService,
  LoginData,
} from '../../service/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-page',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    Field,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private toastNotification = inject(MatSnackBar);

  protected hidePassword = signal(true);

  protected loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, (schemaPath) => {
    // Email validations
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    // Password validations
    required(schemaPath.password, { message: 'Password is required' });
  });

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm(): void {
    this.authenticationService.login(this.loginForm().value()).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigate(['/objectives']);
      },
      error: (error) => {
        this.toastNotification.open(
          this.extractErrorMessage(error),
          'Dismiss',
          {
            duration: 5000,
          },
        );
      },
    });
  }

  private resetForm() {
    this.loginForm().reset();
    this.loginModel.set({
      email: '',
      password: '',
    });
  }

  private extractErrorMessage(httpError: HttpErrorResponse): string {
    let errorMsg: string = 'Login failed';
    if (!httpError) return errorMsg;

    if (httpError.error instanceof ErrorEvent) {
      // Client side or network error occurred.
      return `An error occurred: ${httpError.error.message}`;
    }

    const status = httpError.status;
    if (status === 401)
      errorMsg = 'Invalid credentials or user is not registered';
    if (status > 500 && status < 600) {
      errorMsg =
        "The server isn't currently responding. Please try again later.";
    }

    return errorMsg;
  }
}
