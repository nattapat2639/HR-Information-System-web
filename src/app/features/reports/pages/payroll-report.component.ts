import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-payroll-report',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="reports"
      pageKey="payroll"
      pageTitleKey="PAGES.REPORTS.PAYROLL.TITLE"
      pageSubtitleKey="PAGES.REPORTS.PAYROLL.SUBTITLE"
      contentTitleKey="PAGES.REPORTS.PAYROLL.CONTENT_TITLE"
      contentSubtitleKey="PAGES.REPORTS.PAYROLL.CONTENT_SUBTITLE"
      todoKey="PAGES.REPORTS.PAYROLL.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollReportComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.REPORTS.ACTIONS.RUN', icon: 'play_arrow', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.PAY_PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_MONTH', 'COMMON.PERIODS.LAST_MONTH']
    },
    {
      labelKey: 'COMMON.FIELDS.PAY_GROUP',
      type: 'select',
      queryKey: 'payGroup',
      optionKeys: ['PAGES.PAYROLL.GENERATE.PAY_GROUPS.MONTHLY', 'PAGES.PAYROLL.GENERATE.PAY_GROUPS.BI_WEEKLY']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.REPORTS.PAYROLL.COLUMNS.PAY_GROUP',
    'PAGES.REPORTS.PAYROLL.COLUMNS.GROSS_PAY',
    'PAGES.REPORTS.PAYROLL.COLUMNS.NET_PAY',
    'PAGES.REPORTS.PAYROLL.COLUMNS.STATUS'
  ];
}
