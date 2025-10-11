import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
      },
      {
        path: 'employee-records',
        loadChildren: () =>
          import('./features/employee-records/employee-records.routes').then(
            (m) => m.EMPLOYEE_RECORD_ROUTES
          )
      },
      {
        path: 'leave-management',
        loadChildren: () =>
          import('./features/leave-management/leave-management.routes').then(
            (m) => m.LEAVE_ROUTES
          )
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./features/payroll/payroll.routes').then((m) => m.PAYROLL_ROUTES)
      },
      {
        path: 'performance',
        loadChildren: () =>
          import('./features/performance/performance.routes').then(
            (m) => m.PERFORMANCE_ROUTES
          )
      },
      {
        path: 'training',
        loadChildren: () =>
          import('./features/training/training.routes').then((m) => m.TRAINING_ROUTES)
      },
      {
        path: 'engagement',
        loadChildren: () =>
          import('./features/engagement/engagement.routes').then(
            (m) => m.ENGAGEMENT_ROUTES
          )
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.routes').then((m) => m.REPORT_ROUTES)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/user-management/user-management.routes').then(
            (m) => m.USER_MANAGEMENT_ROUTES
          )
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
