import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { LeaveHistoryComponent } from './pages/leave-history.component';
import { LeaveListComponent } from './pages/leave-list.component';
import { LeaveRequestFormComponent } from './pages/leave-request-form.component';
import { TeamLeaveListComponent } from './pages/team-leave-list.component';

export const LEAVE_ROUTES: Routes = [
  {
    path: 'my',
    component: LeaveListComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.LEAVE.MY.TITLE' }
  },
  {
    path: 'create',
    component: LeaveRequestFormComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.LEAVE.CREATE.TITLE' }
  },
  {
    path: 'team',
    component: TeamLeaveListComponent,
    canMatch: [roleGuard],
    data: {
      titleKey: 'PAGES.LEAVE.TEAM.TITLE',
      requiredRoles: ['Manager', 'Admin'],
      requiredPermission: 'team:approve'
    }
  },
  {
    path: 'history',
    component: LeaveHistoryComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.LEAVE.HISTORY.TITLE' }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my'
  }
];
