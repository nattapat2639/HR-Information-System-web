import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { AuthService, AuthProfile, LoginResponse } from './auth.service';

export interface AuthSession {
  token: string;
  displayName: string;
  email: string;
  roles: string[];
  permissions: string[];
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthContextService {
  private readonly storageKey = 'hris.auth.session';
  private readonly authService = inject(AuthService);

  private readonly session = signal<AuthSession | null>(this.restoreSession());
  private readonly sessionValidated = signal(false);
  private readonly validationInFlight = signal(false);

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly displayName = computed(() => this.session()?.displayName ?? '');
  readonly emailAddress = computed(() => this.session()?.email ?? '');
  readonly activeRoles = computed(() => this.session()?.roles ?? []);

  hasRole(role: string): boolean {
    const roles = this.session()?.roles ?? [];
    return roles.some((value) => value.localeCompare(role, undefined, { sensitivity: 'accent' }) === 0);
  }

  hasPermission(permission: string): boolean {
    const permissions = this.session()?.permissions ?? [];
    return permissions.includes(permission);
  }

  getToken(): string | null {
    return this.session()?.token ?? null;
  }

  getRoles(): string[] {
    return [...(this.session()?.roles ?? [])];
  }

  getPermissions(): string[] {
    return [...(this.session()?.permissions ?? [])];
  }

  applyLogin(response: LoginResponse): void {
    const session: AuthSession = {
      token: response.token,
      displayName: response.displayName,
      email: response.email,
      roles: response.roles ?? [],
      permissions: response.permissions ?? [],
      expiresAt: response.expiresAt
    };
    this.session.set(session);
    this.sessionValidated.set(true);
    this.persist(session);
  }

  applyProfile(profile: AuthProfile): void {
    const current = this.session();
    if (!current) {
      return;
    }

    const updated: AuthSession = {
      token: current.token,
      displayName: profile.displayName,
      email: profile.email,
      roles: profile.roles ?? [],
      permissions: profile.permissions ?? [],
      expiresAt: profile.expiresAt
    };

    this.session.set(updated);
    this.sessionValidated.set(true);
    this.persist(updated);
  }

  clearSession(): void {
    this.session.set(null);
    this.sessionValidated.set(false);
    this.clearPersisted();
  }

  ensureSessionUpToDate(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    if (this.sessionValidated() && !this.isTokenExpired()) {
      return of(true);
    }

    if (this.isTokenExpired()) {
      return this.refreshSession();
    }

    this.validationInFlight.set(true);
    return this.authService.profile().pipe(
      map((profile) => {
        this.applyProfile(profile);
        return true;
      }),
      catchError((error) => {
        if (error?.status === 401) {
          return this.refreshSession();
        }

        this.clearSession();
        return of(false);
      }),
      finalize(() => this.validationInFlight.set(false))
    );
  }

  private refreshSession(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    return this.authService.refresh().pipe(
      map((response) => {
        this.applyLogin(response);
        return true;
      }),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  private isTokenExpired(): boolean {
    const expiresAt = this.session()?.expiresAt;
    if (!expiresAt) {
      return true;
    }

    const expiry = new Date(expiresAt).getTime();
    if (Number.isNaN(expiry)) {
      return true;
    }

    const now = Date.now();
    return expiry <= now;
  }

  private restoreSession(): AuthSession | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<AuthSession>;
      if (!parsed?.token || !parsed.expiresAt || !Array.isArray(parsed.roles)) {
        return null;
      }

      return {
        token: parsed.token,
        displayName: parsed.displayName ?? '',
        email: parsed.email ?? '',
        roles: parsed.roles ?? [],
        permissions: parsed.permissions ?? [],
        expiresAt: parsed.expiresAt
      };
    } catch {
      return null;
    }
  }

  private persist(session: AuthSession): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  private clearPersisted(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(this.storageKey);
  }
}
