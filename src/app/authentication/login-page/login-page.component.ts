import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import {
  createUsernameFormControl,
  createPasswordFormControl,
  UsernameFieldComponent,
  PasswordFieldComponent,
} from '../field-components/field-components.component';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login-page',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    RouterLink,
    UsernameFieldComponent,
    PasswordFieldComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  private authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  private router = inject(Router);

  usernameFormControl: FormControl = createUsernameFormControl();
  passwordFormControl: FormControl = createPasswordFormControl();

  formGroup: FormGroup | any = null;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      usernameFieldControl: this.usernameFormControl,
      passwordFormControl: this.passwordFormControl,
    });
  }

  submitForm(): void {
    // Get the username value and passwords, encrypt the password and send it to services.
    // For now, just go forward with whatever user it is.

    let isRegistered = this.authenticationService.getUserByEmail(
      this.formGroup.getRawValue()?.usernameFieldControl
    );

    if (isRegistered) {
      this.router.navigate(['/objectives', isRegistered.id]);
    }
    // Else _> Toast with error?
  }
}
