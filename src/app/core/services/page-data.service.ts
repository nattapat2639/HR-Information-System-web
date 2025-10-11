import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PageRow {
  columns: Record<string, string>;
  actions?: Array<{ labelKey: string; icon: string; actionKey: string }>;
}

export interface PageDataResponse {
  module: string;
  page: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  rows: PageRow[];
  noteKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getPageData(
    module: string,
    page: string,
    query: Record<string, string> = {}
  ): Observable<PageDataResponse> {
    const params = new HttpParams({ fromObject: query });
    return this.http.get<PageDataResponse>(`${this.baseUrl}/page-data/${module}/${page}`, { params });
  }
}
