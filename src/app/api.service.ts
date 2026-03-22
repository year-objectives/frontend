import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  get<T>(path: string) {
    return this.http.get<T>(`${this.apiUrl}${path}`);
  }

  post<T>(path: string, body: any | null) {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
