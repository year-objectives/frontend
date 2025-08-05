import { provideRouter, Routes } from '@angular/router';
import { ObjectiveContainerComponent } from './objective-container/objective-container.component';
import { LoginPageComponent } from './authentication/login-page/login-page.component';
import { CreateAccountPageComponent } from './authentication/create-account-page/create-account-page.component';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'create-account', component: CreateAccountPageComponent },
  { path: 'home', redirectTo: '/objectives', pathMatch: 'full' },
  { path: 'objectives', component: ObjectiveContainerComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes)],
};
