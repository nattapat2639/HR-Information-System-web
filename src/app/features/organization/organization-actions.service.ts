import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionResponse } from '../../core/models/action-response.model';
import { environment } from '../../../environments/environment';
import { OrganizationOverview } from './models/organization-overview.model';

@Injectable({ providedIn: 'root' })
export class OrganizationActionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private buildParams(filters: Record<string, string> = {}): HttpParams {
    return new HttpParams({ fromObject: filters });
  }

  syncStructure(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/organization/structure/sync`, {});
  }

  exportStructure(filters: Record<string, string> = {}): Observable<Blob> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/organization/structure/export`, {
      responseType: 'blob',
      params
    });
  }

  publishPlan(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/organization/workforce-plan/publish`, {});
  }

  requestHeadcount(payload: {
    department: string;
    requestedHeadcount: number;
    requestedBy: string;
    justification: string;
  }): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/organization/workforce-plan/request`, payload);
  }

  exportWorkforcePlan(filters: Record<string, string> = {}): Observable<Blob> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/organization/workforce-plan/export`, {
      responseType: 'blob',
      params
    });
  }

  getOverview(filters: Record<string, string> = {}): Observable<OrganizationOverview> {
    const params = this.buildParams(filters);
    return this.http.get<OrganizationOverview>(`${this.baseUrl}/organization/overview`, { params });
  }
}
