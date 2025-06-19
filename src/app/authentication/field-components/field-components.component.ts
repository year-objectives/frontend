import { Component, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-name-field',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './name-field.component.html',
  styles: ``,
})
export class NameFieldComponent {
  nameFormControl = input.required<FormControl>();
}

@Component({
  selector: 'app-username-field',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './username-field.component.html',
  styles: ``,
})
export class UsernameFieldComponent {
  usernameFormControl = input.required<FormControl>();
}

@Component({
  selector: 'app-password-field',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './password-field.component.html',
  styles: ``,
})
export class PasswordFieldComponent {
  passwordFormControl = input.required<FormControl>();
}

export function createNameFormControl(): FormControl {
  return new FormControl('', [Validators.required]);
}

export function createUsernameFormControl(): FormControl {
  return new FormControl('', [Validators.required, Validators.email]);
}

export function createPasswordFormControl(): FormControl {
  return new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(64),
    lowercasePasswordValidator(/(?=.*?[a-z])/),
    uppercasePasswordValidator(/(?=.*?[A-Z])/),
    specialCharacterValidator(/(?=.*?[#?!@$%^&*-])/),
    Validators.pattern(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).$'
    ),
  ]);
}

export function lowercasePasswordValidator(regexToTest: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    regexToTest.test(control.value)
      ? null
      : { missingLowerCase: { value: control.value } };
}

export function uppercasePasswordValidator(regexToTest: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    regexToTest.test(control.value)
      ? null
      : { missingUpperCase: { value: control.value } };
}

export function specialCharacterValidator(regexToTest: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    regexToTest.test(control.value)
      ? null
      : { missingSpecialCharacter: { value: control.value } };
}
