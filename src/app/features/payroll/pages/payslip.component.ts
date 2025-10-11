import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="payroll"
      pageKey="my"
      pageTitleKey="PAGES.PAYROLL.MY.TITLE"
      pageSubtitleKey="PAGES.PAYROLL.MY.SUBTITLE"
      contentTitleKey="PAGES.PAYROLL.MY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PAYROLL.MY.CONTENT_SUBTITLE"
      todoKey="PAGES.PAYROLL.MY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayslipComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PAYROLL.MY.ACTIONS.DOWNLOAD', icon: 'download', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.PAY_PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_MONTH', 'COMMON.PERIODS.LAST_MONTH']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.PAYROLL.MY.COLUMNS.COMPONENT',
    'PAGES.PAYROLL.MY.COLUMNS.AMOUNT',
    'PAGES.PAYROLL.MY.COLUMNS.NOTES'
  ];
}
