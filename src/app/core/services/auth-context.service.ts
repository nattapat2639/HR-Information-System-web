import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthContextService {
  private readonly roles = signal<Set<string>>(new Set(['Admin', 'Manager', 'User']));
  private readonly permissions = signal<Set<string>>(new Set());

  hasRole(role: string): boolean {
    return this.roles().has(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().has(permission);
  }

  setRoles(roles: string[]): void {
    this.roles.set(new Set(roles));
  }

  setPermissions(permissions: string[]): void {
    this.permissions.set(new Set(permissions));
  }
}
