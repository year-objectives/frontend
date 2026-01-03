import { Component, inject, signal } from '@angular/core';
import {
  Field,
  form,
  required,
  email,
  minLength,
  maxLength,
  pattern,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {
  AuthenticationService,
  SignUpData,
} from '../../service/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-account-page',
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatIcon, Field],
  templateUrl: './create-account-page.component.html',
  styleUrl: './create-account-page.component.scss',
})
export class CreateAccountPageComponent {
  private router = inject(Router);
  private toastNotification = inject(MatSnackBar);
  private authService: AuthenticationService = inject(AuthenticationService);

  protected hidePassword = signal(true);

  protected signUpModel = signal<SignUpData>({
    name: '',
    email: '',
    password: '',
  });

  protected signUpForm = form(this.signUpModel, (schemaPath) => {
    // name validations
    required(schemaPath.name, { message: 'Name is required' });

    // email validations
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    // password validations
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password needs to be at least 8 characters',
    });
    maxLength(schemaPath.password, 64, {
      message: 'Password is too long, limit is 64 characters',
    });
    pattern(schemaPath.password, /(?=.*?[a-z])/, {
      message: 'At least one lowercase character is required',
    });
    pattern(schemaPath.password, /(?=.*?[A-Z])/, {
      message: 'At least one uppercase character is required',
    });
    pattern(schemaPath.password, /(?=.*?[0-9])/, {
      message: 'At least one numeric character is required',
    });
    pattern(schemaPath.password, /(?=.*?[#?!@$%^&*-])/, {
      message:
        'At least one one of the special character (#?!@$%^&*-) is required',
    });
  });

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm() {
    this.authService.createAccount(this.signUpForm().value()).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigateByUrl('/objectives');
      },
      error: (error) => {
        this.toastNotification.open(
          this.extractErrorMessage(error),
          'Dismiss',
          { duration: 5000 },
        );
      },
    });
  }

  private resetForm() {
    this.signUpForm().reset();
    this.signUpModel.set({
      name: '',
      email: '',
      password: '',
    });
  }

  private extractErrorMessage(httpError: HttpErrorResponse): string {
    let errorMsg: string = 'Account creation failed';
    if (!httpError) return errorMsg;

    if (httpError.error instanceof ErrorEvent) {
      // Client side or network error occurred.
      return `An error occurred: ${httpError.error.message}`;
    }

    const status = httpError.status;
    if (status === 401) errorMsg = 'Invalid data or user already created';
    if (status > 500 && status < 600) {
      errorMsg =
        "The server isn't currently responding. Please try again later.";
    }

    return errorMsg;
  }
}
