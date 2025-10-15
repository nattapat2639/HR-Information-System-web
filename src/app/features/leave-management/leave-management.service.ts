import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveTimelineEntry {
  occurredOn: string;
  actor: string;
  action: string;
  remarks?: string | null;
}

export interface LeaveRequestDetail {
  id: string;
  employeeId: string;
  employeeName: string;
  reference: string;
  leaveType: string;
  isHalfDay: boolean;
  startDate: string;
  endDate: string;
  status: string;
  requestedOn: string;
  reason?: string | null;
  contactDuringLeave?: string | null;
  supportingDocumentUrl?: string | null;
  approverId?: string | null;
  approverName?: string | null;
  decisionOn?: string | null;
  managerComment?: string | null;
  timeline: LeaveTimelineEntry[];
}

export interface LeaveType {
  code: string;
  name: string;
  description: string;
  defaultAllowance: number;
  requiresApproval: boolean;
  supportsHalfDay: boolean;
}

export interface LeaveBalance {
  employeeId: string;
  year: number;
  leaveType: string;
  openingBalance: number;
  accrued: number;
  taken: number;
  pending: number;
  remaining: number;
}

export interface CreateLeaveRequestPayload {
  leaveType: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
  contactDuringLeave?: string | null;
  supportingDocumentUrl?: string | null;
}

export interface UpdateLeaveDatesPayload {
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
}

@Injectable({ providedIn: 'root' })
export class LeaveManagementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/leave`;

  submitLeave(payload: CreateLeaveRequestPayload): Observable<LeaveRequestDetail> {
    return this.http.post<LeaveRequestDetail>(`${this.baseUrl}`, payload);
  }

  getRequest(id: string): Observable<LeaveRequestDetail> {
    return this.http.get<LeaveRequestDetail>(`${this.baseUrl}/${id}`);
  }

  withdrawLeave(id: string, comment?: string): Observable<LeaveRequestDetail> {
    return this.http.post<LeaveRequestDetail>(`${this.baseUrl}/${id}/withdraw`, {
      comment: comment ?? ''
    });
  }

  approveLeave(id: string, comment?: string): Observable<LeaveRequestDetail> {
    return this.http.post<LeaveRequestDetail>(`${this.baseUrl}/${id}/approve`, {
      comment: comment ?? ''
    });
  }

  rejectLeave(id: string, comment?: string): Observable<LeaveRequestDetail> {
    return this.http.post<LeaveRequestDetail>(`${this.baseUrl}/${id}/reject`, {
      comment: comment ?? ''
    });
  }

  updateLeaveDates(id: string, payload: UpdateLeaveDatesPayload): Observable<LeaveRequestDetail> {
    return this.http.patch<LeaveRequestDetail>(`${this.baseUrl}/${id}/dates`, payload);
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.baseUrl}/types`);
  }

  getBalances(year?: number): Observable<LeaveBalance[]> {
    const params = year ? new HttpParams().set('year', String(year)) : undefined;
    return this.http.get<LeaveBalance[]>(`${this.baseUrl}/balances`, { params });
  }

  exportHistory(filters: Record<string, string>): Observable<Blob> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get(`${this.baseUrl}/history/export`, {
      params,
      responseType: 'blob'
    });
  }
}
