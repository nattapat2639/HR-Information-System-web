import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { OrganizationStructureComponent } from './pages/organization-structure.component';
import { WorkforcePlanComponent } from './pages/workforce-plan.component';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: 'structure',
    component: OrganizationStructureComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.ORGANIZATION.STRUCTURE.TITLE' }
  },
  {
    path: 'workforce-plan',
    component: WorkforcePlanComponent,
    canMatch: [roleGuard],
    data: { titleKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.TITLE' }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'structure'
  }
];
