import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EmployeeProfile, EmployeeSearchInsights, EmployeeSummary, PagedResult } from './models/employee-profile.model';

@Injectable({ providedIn: 'root' })
export class EmployeeRecordsActionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  exportAll(filters: Record<string, string> = {}, selected: string[] = []): Observable<Blob> {
    let params = new HttpParams({ fromObject: filters });
    if (selected.length > 0) {
      params = params.set('employeeNumbers', selected.join(','));
    }
    return this.http.get(`${this.baseUrl}/employee-records/export`, {
      responseType: 'blob',
      params
    });
  }

  exportSearch(filters: Record<string, string> = {}, selected: string[] = []): Observable<Blob> {
    let params = new HttpParams({ fromObject: filters });
    if (selected.length > 0) {
      params = params.set('employeeNumbers', selected.join(','));
    }
    return this.http.get(`${this.baseUrl}/employee-records/search/export`, {
      responseType: 'blob',
      params
    });
  }

  getEmployees(page = 1, pageSize = 50): Observable<PagedResult<EmployeeSummary>> {
    const params = new HttpParams({ fromObject: { page, pageSize } });
    return this.http
      .get<PagedResult<EmployeeSummary & { id: string; hiredAt: string }>>(`${this.baseUrl}/employees`, { params })
      .pipe(
        map((response) => ({
          ...response,
          items: (response.items ?? []).map((item) => ({
            id: item.id,
            employeeNumber: item.employeeNumber,
            fullName: item.fullName,
            department: item.department,
            position: item.position,
            status: item.status
          }))
        }))
      );
  }

  getProfile(employeeNumber: string): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.baseUrl}/employee-records/${encodeURIComponent(employeeNumber)}/profile`);
  }

  getSearchInsights(filters: Record<string, string> = {}): Observable<EmployeeSearchInsights> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<EmployeeSearchInsights>(`${this.baseUrl}/employee-records/search/insights`, { params });
  }
}
