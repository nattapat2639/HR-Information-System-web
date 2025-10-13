import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionResponse } from '../../core/models/action-response.model';
import { environment } from '../../../environments/environment';

export interface SecurityControlUpdatePayload {
  control: string;
  status: string;
  owner: string;
  severity: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsActionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  updateSystemConfiguration(payload: {
    primaryTimezone?: string;
    workweekTemplate?: string;
    holidayCalendar?: string;
    dataResidency?: string;
  }): Observable<ActionResponse> {
    return this.http.put<ActionResponse>(`${this.baseUrl}/settings/system`, payload);
  }

  resetSystemConfiguration(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/settings/system/reset`, {});
  }

  syncSystemConfiguration(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/settings/system/sync`, {});
  }

  updateSecurityControls(controls: SecurityControlUpdatePayload[]): Observable<ActionResponse> {
    return this.http.put<ActionResponse>(`${this.baseUrl}/settings/security`, { controls });
  }

  enforceSecurityPolicies(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/settings/security/enforce`, {});
  }

  runSecurityAudit(): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.baseUrl}/settings/security/run-audit`, {});
  }
}
