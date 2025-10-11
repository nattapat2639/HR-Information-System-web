import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-payroll-generate',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="payroll"
      pageKey="generate"
      pageTitleKey="PAGES.PAYROLL.GENERATE.TITLE"
      pageSubtitleKey="PAGES.PAYROLL.GENERATE.SUBTITLE"
      contentTitleKey="PAGES.PAYROLL.GENERATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PAYROLL.GENERATE.CONTENT_SUBTITLE"
      todoKey="PAGES.PAYROLL.GENERATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollGenerateComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PAYROLL.GENERATE.ACTIONS.RUN_PAYROLL', icon: 'play_circle', variant: 'primary' },
    { labelKey: 'PAGES.PAYROLL.GENERATE.ACTIONS.PREVIEW', icon: 'visibility', variant: 'secondary' }
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
}
