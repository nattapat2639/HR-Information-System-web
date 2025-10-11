import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardPageComponent } from './pages/dashboard-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.DASHBOARD.TITLE'
    }
  }
];
