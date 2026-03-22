import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';

export interface NewObjectiveData {
  period: string;
  description: string;
  isReversible: boolean;
  numberOfOccurrences: number;
}

export interface ObjectiveDto {
  id: string;
  name: string;
  description: string;
  type: string;
  reversible: boolean;
  due_date: number;
  target_amount: number;
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService {
  private apiService: ApiService = inject(ApiService);
  readonly objectivesUrl = '/objectives';

  getCurrentObjectives() {
    return this.apiService.get<ObjectiveDto[]>(this.objectivesUrl);
  }

  createObjective(newObjective: NewObjectiveData) {
    return this.apiService.post<any>(this.objectivesUrl, newObjective);
  }
}
