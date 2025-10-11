import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { EmployeeProfileComponent } from './pages/employee-profile.component';
import { EmployeeRecordsPageComponent } from './pages/employee-records-page.component';
import { EmployeeSearchComponent } from './pages/employee-search.component';

export const EMPLOYEE_RECORD_ROUTES: Routes = [
  {
    path: 'all',
    component: EmployeeRecordsPageComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.EMPLOYEE_RECORDS.LIST.TITLE' }
  },
  {
    path: 'profile',
    component: EmployeeProfileComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE' }
  },
  {
    path: 'profile/:id',
    component: EmployeeProfileComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE' }
  },
  {
    path: 'search',
    component: EmployeeSearchComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.EMPLOYEE_RECORDS.SEARCH.TITLE' }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all'
  }
];
