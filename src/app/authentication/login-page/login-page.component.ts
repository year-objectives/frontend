import { Component, OnInit } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import {
  createUsernameFormControl,
  createPasswordFormControl,
  UsernameFieldComponent,
  PasswordFieldComponent,
} from '../field-components/field-components.component';

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

    let payload = JSON.stringify(this.formGroup.getRawValue());

    // Send payload to services (Password is exposed!)
  }
}
