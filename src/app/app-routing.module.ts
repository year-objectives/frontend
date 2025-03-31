import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectiveContainerComponent} from './objective-container/objective-container.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: ObjectiveContainerComponent }, // temporary
  { path: 'home', component: ObjectiveContainerComponent },
  { path: 'objectives', component: ObjectiveContainerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
