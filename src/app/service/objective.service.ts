import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface NewObjectiveData {
  period: string;
  description: string;
  isReversible: boolean;
  numberOfOccurrences: number;
}

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService {
  private httpClient: HttpClient = inject(HttpClient);

  getCurrentObjectives() {
    return httpResource(() => '/api/v1/objectives');
  }

  createObjective(newObjective: NewObjectiveData) {
    return this.httpClient.post<any>('/api/v1/objectives', newObjective);
  }
}
