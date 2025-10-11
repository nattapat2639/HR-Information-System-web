import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { PayrollGenerateComponent } from './pages/payroll-generate.component';
import { PayrollSummaryComponent } from './pages/payroll-summary.component';
import { PayslipComponent } from './pages/payslip.component';

export const PAYROLL_ROUTES: Routes = [
  {
    path: 'my',
    component: PayslipComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PAYROLL.MY.TITLE' }
  },
  {
    path: 'summary',
    component: PayrollSummaryComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PAYROLL.SUMMARY.TITLE', requiredRoles: ['Manager', 'Admin'] }
  },
  {
    path: 'generate',
    component: PayrollGenerateComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PAYROLL.GENERATE.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my'
  }
];
