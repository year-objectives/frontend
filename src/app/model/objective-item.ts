import { ObjectiveCell } from './objective-cell';
import { PeriodType } from './period-type';

export interface ObjectiveItem {
  id: number;
  userId?: number;
  description: string;
  periodType: PeriodType;
  isReversible?: boolean;
  objectiveCellList: ObjectiveCell[];
}
