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
import {
  createUsernameFormControl,
  createPasswordFormControl,
  UsernameFieldComponent,
  PasswordFieldComponent,
  NameFieldComponent,
  createNameFormControl,
} from '../field-components/field-components.component';

@Component({
  selector: 'app-create-account-page',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    UsernameFieldComponent,
    PasswordFieldComponent,
    NameFieldComponent,
  ],
  templateUrl: './create-account-page.component.html',
  styleUrl: './create-account-page.component.scss',
})
export class CreateAccountPageComponent implements OnInit {
  nameFormControl: FormControl = createNameFormControl();
  usernameFormControl: FormControl = createUsernameFormControl();
  passwordFormControl: FormControl = createPasswordFormControl();

  formGroup: FormGroup | any = null;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      nameFormControl: this.nameFormControl,
      usernameFormControl: this.usernameFormControl,
      passwordFormControl: this.passwordFormControl,
    });
  }

  submitForm(): void {
    // Check if is possible to create an account with the given data

    let payload = JSON.stringify(this.formGroup.getRawValue());

    // Send payload to services (Password is exposed!)
  }
}
