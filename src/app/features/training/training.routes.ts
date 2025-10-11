import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { TrainingCalendarComponent } from './pages/training-calendar.component';
import { TrainingFormComponent } from './pages/training-form.component';
import { TrainingProgressComponent } from './pages/training-progress.component';
import { TrainingRequestsComponent } from './pages/training-requests.component';

export const TRAINING_ROUTES: Routes = [
  {
    path: 'calendar',
    component: TrainingCalendarComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.TRAINING.CALENDAR.TITLE' }
  },
  {
    path: 'progress',
    component: TrainingProgressComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.TRAINING.PROGRESS.TITLE' }
  },
  {
    path: 'requests',
    component: TrainingRequestsComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.TRAINING.REQUESTS.TITLE' }
  },
  {
    path: 'create',
    component: TrainingFormComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.TRAINING.CREATE.TITLE', requiredRoles: ['Manager', 'Admin'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'calendar'
  }
];
