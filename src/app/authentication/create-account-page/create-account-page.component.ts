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
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { UserRegisterRequestDto } from '../dtos/user-register-request-dto';

@Component({
  selector: 'app-create-account-page',
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatIcon, Field],
  templateUrl: './create-account-page.component.html',
  styleUrl: './create-account-page.component.scss',
})
export class CreateAccountPageComponent {
  private router = inject(Router);
  private authService: AuthenticationService = inject(AuthenticationService);

  protected hidePassword = signal(true);

  protected signUpModel = signal<UserRegisterRequestDto>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    username: '',
  });

  protected signUpForm = form(this.signUpModel, (schemaPath) => {
    // name validations
    required(schemaPath.first_name, { message: 'First name is required' });
    required(schemaPath.last_name, { message: 'Last name is required' });
    required(schemaPath.username, { message: 'Username is required' });

    // email validations
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    // password validations
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 10, {
      message: 'Password needs to be at least 10 characters',
    });
    maxLength(schemaPath.password, 64, {
      message: 'Password is too long, limit is 64 characters',
    });
    /* TODO: Keep or discard these validations?
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
    */
  });

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm() {
    this.authService.createAccount(this.signUpForm().value()).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigateByUrl('/login');
      },
    });
  }

  private resetForm() {
    this.signUpForm().reset();
    this.signUpModel.set({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      username: '',
    });
  }
}
