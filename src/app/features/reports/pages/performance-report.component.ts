import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-performance-report',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="reports"
      pageKey="performance"
      pageTitleKey="PAGES.REPORTS.PERFORMANCE.TITLE"
      pageSubtitleKey="PAGES.REPORTS.PERFORMANCE.SUBTITLE"
      contentTitleKey="PAGES.REPORTS.PERFORMANCE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.REPORTS.PERFORMANCE.CONTENT_SUBTITLE"
      todoKey="PAGES.REPORTS.PERFORMANCE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceReportComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.REPORTS.ACTIONS.RUN', icon: 'play_arrow', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_YEAR', 'COMMON.PERIODS.LAST_YEAR']
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      optionKeys: ['COMMON.DEPARTMENTS.HR', 'COMMON.DEPARTMENTS.IT', 'COMMON.DEPARTMENTS.FINANCE']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.REPORTS.PERFORMANCE.COLUMNS.DEPARTMENT',
    'PAGES.REPORTS.PERFORMANCE.COLUMNS.AVERAGE_SCORE',
    'PAGES.REPORTS.PERFORMANCE.COLUMNS.TREND',
    'PAGES.REPORTS.PERFORMANCE.COLUMNS.STATUS'
  ];
}
