import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-team-performance',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="performance"
      pageKey="team"
      pageTitleKey="PAGES.PERFORMANCE.TEAM.TITLE"
      pageSubtitleKey="PAGES.PERFORMANCE.TEAM.SUBTITLE"
      contentTitleKey="PAGES.PERFORMANCE.TEAM.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PERFORMANCE.TEAM.CONTENT_SUBTITLE"
      todoKey="PAGES.PERFORMANCE.TEAM.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamPerformanceComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PERFORMANCE.TEAM.ACTIONS.APPROVE', icon: 'thumb_up', variant: 'primary' },
    { labelKey: 'PAGES.PERFORMANCE.TEAM.ACTIONS.REQUEST_CHANGES', icon: 'edit_note', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.EMPLOYEE',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.SEARCH_EMPLOYEE',
      queryKey: 'employee'
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.PENDING', 'COMMON.STATUSES.SUBMITTED']
    },
    {
      labelKey: 'COMMON.FIELDS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_YEAR', 'COMMON.PERIODS.LAST_YEAR']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.PERFORMANCE.TEAM.COLUMNS.EMPLOYEE',
    'PAGES.PERFORMANCE.TEAM.COLUMNS.REVIEW_CYCLE',
    'PAGES.PERFORMANCE.TEAM.COLUMNS.SCORE',
    'PAGES.PERFORMANCE.TEAM.COLUMNS.STATUS'
  ];
}
