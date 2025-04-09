import { Component } from '@angular/core';
import { ObjectiveItem } from '../model/objective-item';
import { PeriodType } from '../model/period-type';
import { ObjectiveCell } from '../model/objective-cell';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-objective-container',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './objective-container.component.html',
  styleUrl: './objective-container.component.scss',
})
export class ObjectiveContainerComponent {
  periodTypeList: string[] = Object.values(PeriodType);

  getObjectiveListByPeriod(periodKey: string) {
    return this.objectiveItemList.filter(
      (item) => item.periodType == periodKey
    );
  }

  // Dummy data
  objectiveItemList: ObjectiveItem[] = [
    {
      id: 1,
      periodType: PeriodType.daily,
      description: 'Andar de motoca',
      objectiveCellList: this.createNumberOfCellInList(5),
    },
    {
      id: 2,
      periodType: PeriodType.daily,
      description: 'Trabalhar',
      objectiveCellList: this.createNumberOfCellInList(3),
      isReversible: true,
    },
    {
      id: 3,
      periodType: PeriodType.daily,
      description: 'Comere',
      objectiveCellList: this.createNumberOfCellInList(2),
      isReversible: false,
    },
    {
      id: 4,
      periodType: PeriodType.weekly,
      description: 'Lavar roupa',
      objectiveCellList: this.createNumberOfCellInList(1),
    },
    {
      id: 5,
      periodType: PeriodType.weekly,
      description: 'Comer pizza',
      objectiveCellList: this.createNumberOfCellInList(4),
      isReversible: true,
    },
    {
      id: 6,
      periodType: PeriodType.weekly,
      description: 'Escalar',
      objectiveCellList: this.createNumberOfCellInList(3),
      isReversible: false,
    },
    {
      id: 7,
      periodType: PeriodType.yearly,
      description: 'Receber aumento',
      objectiveCellList: this.createNumberOfCellInList(1),
    },
    {
      id: 8,
      periodType: PeriodType.yearly,
      description: 'Fazer o mastery',
      objectiveCellList: this.createNumberOfCellInList(4),
    },
  ];

  createNumberOfCellInList(size: number): ObjectiveCell[] {
    const list = [];
    for (let i = 0; i < size; i++) {
      list[i] = {
        isChecked: Math.round(Math.random()) == 0 ? false : true,
        checkedTimestamp: Date.now(),
      };
    }
    return list;
  }

  handleCellClick(objectiveCell: ObjectiveCell) {
    if (
      !objectiveCell.isChecked ||
      this.findObjectiveItemForCell(objectiveCell)?.isReversible
    ) {
      objectiveCell.isChecked = !objectiveCell.isChecked;
      objectiveCell.checkedTimestamp = Date.now();
    }
  }

  findObjectiveItemForCell(objectiveCell: ObjectiveCell): ObjectiveItem {
    return this.objectiveItemList.filter(
      (item) =>
        item.objectiveCellList.filter((cell) => cell == objectiveCell).length >
        0
    )[0];
  }
}
