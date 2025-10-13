import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { NotificationsComponent } from './pages/notifications.component';
import { ProfileFormComponent } from './pages/profile-form.component';
import { SecuritySettingsComponent } from './pages/security-settings.component';
import { SystemConfigComponent } from './pages/system-config.component';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileFormComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.SETTINGS.PROFILE.TITLE' }
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.SETTINGS.NOTIFICATIONS.TITLE' }
  },
  {
    path: 'system',
    component: SystemConfigComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.SETTINGS.SYSTEM.TITLE',
      requiredRoles: ['Admin'],
      requiredPermission: 'settings:manage'
    }
  },
  {
    path: 'security',
    component: SecuritySettingsComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.SETTINGS.SECURITY.TITLE',
      requiredRoles: ['Admin'],
      requiredPermission: 'security:manage'
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile'
  }
];
