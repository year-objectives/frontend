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
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-account-page',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatIcon,
  ],
  templateUrl: './create-account-page.component.html',
  styleUrl: './create-account-page.component.scss',
})
export class CreateAccountPageComponent {
  private router = inject(Router);
  private toastNotification = inject(MatSnackBar);
  private authService: AuthenticationService = inject(AuthenticationService);

  protected hidePassword = signal(true);
  protected nameErrorMsg = signal('');
  protected emailErrorMsg = signal('');
  protected passwordErrorMsg = signal('');

  readonly name = new FormControl('', Validators.required);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm(): void {
    if (this.name.valid && this.email.valid && this.password.valid) {
      this.createNewAccount();
    }

    if (this.name.hasError('required'))
      this.nameErrorMsg.set('Name is required');

    if (this.email.hasError('email'))
      this.emailErrorMsg.set('Not a valid email');

    if (this.email.hasError('required'))
      this.emailErrorMsg.set('Email is required');

    if (this.password.hasError('required'))
      this.passwordErrorMsg.set('Password is required');

    if (this.password.hasError('minlength'))
      this.passwordErrorMsg.set('Password needs to be 8 digits or longer');
  }

  private createNewAccount() {
    this.authService
      .createAccount(
        this.name.value as string,
        this.email.value as string,
        this.password.value as string,
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/objectives'),
        error: (error) => {
          this.toastNotification.open(
            this.extractErrorMessage(error),
            'Dismiss',
            { duration: 5000 },
          );
        },
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
