import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { PerformanceCreateComponent } from './pages/performance-create.component';
import { PerformanceReviewComponent } from './pages/performance-review.component';
import { TeamPerformanceComponent } from './pages/team-performance.component';

export const PERFORMANCE_ROUTES: Routes = [
  {
    path: 'my',
    component: PerformanceReviewComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PERFORMANCE.MY.TITLE' }
  },
  {
    path: 'team',
    component: TeamPerformanceComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PERFORMANCE.TEAM.TITLE', requiredRoles: ['Manager', 'Admin'] }
  },
  {
    path: 'create',
    component: PerformanceCreateComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.PERFORMANCE.CREATE.TITLE', requiredRoles: ['Manager', 'Admin'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my'
  }
];
