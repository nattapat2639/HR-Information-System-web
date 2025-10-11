import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-performance-review',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="performance"
      pageKey="my"
      pageTitleKey="PAGES.PERFORMANCE.MY.TITLE"
      pageSubtitleKey="PAGES.PERFORMANCE.MY.SUBTITLE"
      contentTitleKey="PAGES.PERFORMANCE.MY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PERFORMANCE.MY.CONTENT_SUBTITLE"
      todoKey="PAGES.PERFORMANCE.MY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceReviewComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PERFORMANCE.MY.ACTIONS.DOWNLOAD', icon: 'download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_YEAR', 'COMMON.PERIODS.LAST_YEAR']
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.COMPLETED', 'COMMON.STATUSES.IN_PROGRESS']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.PERFORMANCE.MY.COLUMNS.REVIEW_CYCLE',
    'PAGES.PERFORMANCE.MY.COLUMNS.SCORE',
    'PAGES.PERFORMANCE.MY.COLUMNS.MANAGER',
    'PAGES.PERFORMANCE.MY.COLUMNS.STATUS'
  ];
}
