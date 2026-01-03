import { Component, inject, signal } from '@angular/core';
import { Field, form, min, required } from '@angular/forms/signals';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PeriodType } from '../model/period-type';
import {
  NewObjectiveData,
  ObjectiveService,
} from '../service/objective.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-objective',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    Field,
  ],
  templateUrl: './create-objective.component.html',
  styleUrl: './create-objective.component.scss',
})
export class CreateObjectiveComponent {
  private objService = inject(ObjectiveService);
  private toastNotification = inject(MatSnackBar);
  private dialogData = inject(MAT_DIALOG_DATA);

  readonly possiblePeriodTypes = [
    PeriodType.daily,
    PeriodType.monthly,
    PeriodType.weekly,
    PeriodType.yearly,
  ];

  protected objectiveModel = signal<NewObjectiveData>({
    period: this.possiblePeriodTypes.includes(this.dialogData)
      ? this.dialogData
      : this.possiblePeriodTypes[0],
    description: '',
    isReversible: false,
    numberOfOccurrences: 1,
  });

  protected objectiveForm = form(this.objectiveModel, (schemaPath) => {
    required(schemaPath.description, { message: 'Description is required' });
    min(schemaPath.numberOfOccurrences, 1, {
      message: 'Number of occurrences has to be greater than zero',
    });
  });

  constructor(public dialogRef: MatDialogRef<CreateObjectiveComponent>) {}

  submitNewObjective() {
    this.objService.createObjective(this.objectiveForm().value()).subscribe({
      next: () => {
        this.resetForm();
        this.dialogRef.close('Success!');
      },
      error: (error) => {
        this.toastNotification.open(
          this.extractErrorMessage(error),
          'Dismiss',
          { duration: 5000 },
        );
      },
    });
  }

  private resetForm() {
    this.objectiveForm().reset();
    this.objectiveModel.set({
      period: this.possiblePeriodTypes[0],
      description: '',
      isReversible: false,
      numberOfOccurrences: 1,
    });
  }

  private extractErrorMessage(httpError: HttpErrorResponse): string {
    let errorMsg: string = 'Objective creation failed';
    if (!httpError) return errorMsg;

    if (httpError.error instanceof ErrorEvent) {
      // Client side or network error occurred.
      return `An error occurred: ${httpError.error.message}`;
    }

    const status = httpError.status;
    if (status === 401) errorMsg = 'Invalid data or objective already created';
    if (status > 500 && status < 600) {
      errorMsg =
        "The server isn't currently responding. Please try again later.";
    }

    return errorMsg;
  }
}
