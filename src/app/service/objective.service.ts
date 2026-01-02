import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService {
  httpClient: HttpClient = inject(HttpClient);

  getCurrentObjectives() {
    return httpResource(() => '/api/v1/objectives');
  }
}
