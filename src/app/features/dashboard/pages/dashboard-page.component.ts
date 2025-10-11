import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="dashboard"
      pageKey="overview"
      pageTitleKey="PAGES.DASHBOARD.TITLE"
      pageSubtitleKey="PAGES.DASHBOARD.SUBTITLE"
      contentTitleKey="PAGES.DASHBOARD.CONTENT_TITLE"
      contentSubtitleKey="PAGES.DASHBOARD.CONTENT_SUBTITLE"
      todoKey="PAGES.DASHBOARD.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showResetFilterButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.DASHBOARD.ACTIONS.CREATE_REQUEST', icon: 'add_circle', variant: 'primary' },
    { labelKey: 'PAGES.DASHBOARD.ACTIONS.APPROVALS', icon: 'approval', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FILTERS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.THIS_MONTH', 'COMMON.PERIODS.LAST_MONTH', 'COMMON.PERIODS.THIS_QUARTER']
    }
  ];
}
