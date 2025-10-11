import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { EmployeeReportComponent } from './pages/employee-report.component';
import { ExportDataComponent } from './pages/export-data.component';
import { LeaveReportComponent } from './pages/leave-report.component';
import { PayrollReportComponent } from './pages/payroll-report.component';
import { PerformanceReportComponent } from './pages/performance-report.component';

export const REPORT_ROUTES: Routes = [
  {
    path: 'employee',
    component: EmployeeReportComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.REPORTS.EMPLOYEE.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: 'leave',
    component: LeaveReportComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.REPORTS.LEAVE.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: 'payroll',
    component: PayrollReportComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.REPORTS.PAYROLL.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: 'performance',
    component: PerformanceReportComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.REPORTS.PERFORMANCE.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: 'exports',
    component: ExportDataComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.REPORTS.EXPORT.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'employee'
  }
];
