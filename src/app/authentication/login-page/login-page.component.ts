import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-page',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  private router = inject(Router);
  private toastNotification = inject(MatSnackBar);

  protected emailErrorMsg = signal('');
  protected passwordErrorMsg = signal('');
  protected hidePassword = signal(true);

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', Validators.required);

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm(): void {
    if (this.email.valid && this.password.valid) this.onLogin();

    if (this.email.hasError('email'))
      this.emailErrorMsg.set('Not a valid email');

    if (this.email.hasError('required'))
      this.emailErrorMsg.set('Email is required');

    if (this.password.hasError('required'))
      this.passwordErrorMsg.set('Password is required');
  }

  private onLogin() {
    this.authenticationService
      .login(this.email.value as string, this.password.value as string)
      .subscribe({
        next: () => {
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

  private extractErrorMessage(httpError: HttpErrorResponse): string {
    let errorMsg: string = 'Login failed';
    if (!httpError) return errorMsg;

    if (httpError.error instanceof ErrorEvent) {
      // Client side or network error occurred.
      return `An error occurred: ${httpError.error.message}`;
    }

    const status = httpError.status;
    if (status === 401) errorMsg = 'Invalid credentials or not registered user';
    if (status > 500 && status < 600) {
      errorMsg =
        "The server isn't currently responding. Please try again later.";
    }

    return errorMsg;
  }
}
