import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { EmployeeProfileComponent } from './pages/employee-profile.component';
import { EmployeeRecordsPageComponent } from './pages/employee-records-page.component';
import { EmployeeSearchComponent } from './pages/employee-search.component';
import { EmployeeFieldConfigComponent } from './pages/employee-field-config.component';

export const EMPLOYEE_RECORD_ROUTES: Routes = [
  {
    path: 'all',
    component: EmployeeRecordsPageComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.LIST.TITLE',
      requiredRoles: ['Admin']
    }
  },
  {
    path: 'profile',
    component: EmployeeProfileComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE',
      requiredRoles: ['Manager', 'Admin']
    }
  },
  {
    path: 'profile/:id',
    component: EmployeeProfileComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE',
      requiredRoles: ['Manager', 'Admin']
    }
  },
  {
    path: 'search',
    component: EmployeeSearchComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.SEARCH.TITLE',
      requiredRoles: ['Manager', 'Admin']
    }
  },
  {
    path: 'fields',
    component: EmployeeFieldConfigComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TITLE',
      requiredRoles: ['Admin']
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  }
];
