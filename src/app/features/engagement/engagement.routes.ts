import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SurveyCreateComponent } from './pages/survey-create.component';
import { SurveyListComponent } from './pages/survey-list.component';
import { SurveyResultsComponent } from './pages/survey-results.component';

export const ENGAGEMENT_ROUTES: Routes = [
  {
    path: 'surveys',
    component: SurveyListComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.ENGAGEMENT.SURVEYS.TITLE' }
  },
  {
    path: 'results',
    component: SurveyResultsComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.ENGAGEMENT.RESULTS.TITLE', requiredRoles: ['Manager', 'Admin'] }
  },
  {
    path: 'create',
    component: SurveyCreateComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.ENGAGEMENT.CREATE.TITLE', requiredRoles: ['Admin'] }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'surveys'
  }
];
