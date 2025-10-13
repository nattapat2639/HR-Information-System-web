import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  displayName: string;
  email: string;
  roles: string[];
  permissions: string[];
  expiresAt: string;
}

export interface AuthProfile {
  displayName: string;
  email: string;
  roles: string[];
  permissions: string[];
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, request);
  }

  profile(): Observable<AuthProfile> {
    return this.http.get<AuthProfile>(`${this.baseUrl}/auth/profile`);
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/refresh`, {});
  }
}
