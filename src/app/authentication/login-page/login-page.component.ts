import { Component, inject, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { UserLoginRequestDto } from '../dtos/user-login-request-dto';

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

  protected hidePassword = signal(true);

  protected loginModel = signal<UserLoginRequestDto>({
    username: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, (schemaPath) => {
    // Email validations
    required(schemaPath.username, { message: 'Username is required' });

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
    });
  }

  private resetForm() {
    this.loginForm().reset();
    this.loginModel.set({
      username: '',
      password: '',
    });
  }
}
