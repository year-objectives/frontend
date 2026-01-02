import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PeriodType } from '../model/period-type';

@Component({
  selector: 'app-create-objective',
  imports: [
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-objective.component.html',
  styleUrl: './create-objective.component.scss',
})
export class CreateObjectiveComponent {
  data = inject<PeriodType>(MAT_DIALOG_DATA);
  periodControl: FormControl;
  descriptionControl = new FormControl('', Validators.required);
  reversibleControl = new FormControl(false, Validators.required);
  accomplishmentsControl = new FormControl(1, Validators.required);

  constructor() {
    this.periodControl = new FormControl(this.data, Validators.required);
  }

  possiblePeriodTypes = [
    PeriodType.daily,
    PeriodType.monthly,
    PeriodType.weekly,
    PeriodType.yearly,
  ];

  submitNewObjective() {
    // TODO: Continue from here:
    // verify fields validity
    // assemble values into Objective[Accomplishments] object
    // send to service (yet to be created)
    // handle errors with toasts
    // if created, objectives page needs to refresh data
  }
}
