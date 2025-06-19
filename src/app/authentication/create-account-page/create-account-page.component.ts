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
import {
  createUsernameFormControl,
  createPasswordFormControl,
  UsernameFieldComponent,
  PasswordFieldComponent,
  NameFieldComponent,
  createNameFormControl,
} from '../field-components/field-components.component';
import { AuthenticationService } from '../authentication.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  private authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
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
    let rawValue = this.formGroup.getRawValue();

    let newUser: User = {
      id: -1,
      name: rawValue.nameFormControl,
      email: rawValue.usernameFieldControl,
    };

    let createdUserId = this.authenticationService.postNewUser(
      newUser,
      rawValue.passwordFormControl
    );

    debugger;

    if (createdUserId == -1) {
      // User already exist
    } else {
      this.router.navigate(['/objectives', createdUserId]);
    }
  }
}
