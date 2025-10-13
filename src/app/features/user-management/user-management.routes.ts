import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserFormComponent } from './pages/user-form.component';
import { UserListComponent } from './pages/user-list.component';
import { UserRolesComponent } from './pages/user-roles.component';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'list',
    component: UserListComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.USERS.LIST.TITLE',
      requiredRoles: ['Admin'],
      requiredPermission: 'users:manage'
    }
  },
  {
    path: 'create',
    component: UserFormComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.USERS.CREATE.TITLE',
      requiredRoles: ['Admin'],
      requiredPermission: 'users:manage'
    }
  },
  {
    path: 'roles',
    component: UserRolesComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.USERS.ROLES.TITLE',
      requiredRoles: ['Admin'],
      requiredPermission: 'users:manage'
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  }
];
