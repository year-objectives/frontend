import { ObjectiveCell } from "./objectivecell";
import { PeriodType } from "./PeriodType";

export interface ObjectiveItem {
    id: number,
    periodType: PeriodType,
    description: string,
    objectiveCellList: ObjectiveCell[],
    isReversible?: boolean
}
