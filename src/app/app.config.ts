import { provideRouter, Routes } from '@angular/router';
import { ObjectiveContainerComponent } from './objective-container/objective-container.component';

export const routes: Routes = [
  { path: '', redirectTo: '/objectives', pathMatch: 'full' },
  { path: 'home', redirectTo: '/objectives', pathMatch: 'full' },
  { path: 'objectives', component: ObjectiveContainerComponent },
];

export const appConfig = [provideRouter(routes)];
