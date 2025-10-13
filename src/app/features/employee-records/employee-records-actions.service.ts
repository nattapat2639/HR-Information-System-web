import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeRecordsActionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  exportAll(filters: Record<string, string> = {}): Observable<Blob> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get(`${this.baseUrl}/employee-records/export`, {
      responseType: 'blob',
      params
    });
  }

  exportSearch(filters: Record<string, string> = {}): Observable<Blob> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get(`${this.baseUrl}/employee-records/search/export`, {
      responseType: 'blob',
      params
    });
  }
}
