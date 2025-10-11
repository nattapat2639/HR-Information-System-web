import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-payroll-summary',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="payroll"
      pageKey="summary"
      pageTitleKey="PAGES.PAYROLL.SUMMARY.TITLE"
      pageSubtitleKey="PAGES.PAYROLL.SUMMARY.SUBTITLE"
      contentTitleKey="PAGES.PAYROLL.SUMMARY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PAYROLL.SUMMARY.CONTENT_SUBTITLE"
      todoKey="PAGES.PAYROLL.SUMMARY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollSummaryComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PAYROLL.SUMMARY.ACTIONS.GENERATE_REPORT', icon: 'summarize', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.PAY_PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_MONTH', 'COMMON.PERIODS.LAST_MONTH', 'COMMON.PERIODS.CUSTOM']
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      optionKeys: ['COMMON.DEPARTMENTS.HR', 'COMMON.DEPARTMENTS.IT', 'COMMON.DEPARTMENTS.FINANCE']
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.APPROVED', 'COMMON.STATUSES.PENDING']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.PAYROLL.SUMMARY.COLUMNS.DEPARTMENT',
    'PAGES.PAYROLL.SUMMARY.COLUMNS.TOTAL_EMPLOYEES',
    'PAGES.PAYROLL.SUMMARY.COLUMNS.GROSS_PAY',
    'PAGES.PAYROLL.SUMMARY.COLUMNS.NET_PAY'
  ];
}
