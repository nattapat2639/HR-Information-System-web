import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="reports"
      pageKey="leave"
      pageTitleKey="PAGES.REPORTS.LEAVE.TITLE"
      pageSubtitleKey="PAGES.REPORTS.LEAVE.SUBTITLE"
      contentTitleKey="PAGES.REPORTS.LEAVE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.REPORTS.LEAVE.CONTENT_SUBTITLE"
      todoKey="PAGES.REPORTS.LEAVE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveReportComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.REPORTS.ACTIONS.RUN', icon: 'play_arrow', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.YEAR',
      type: 'select',
      queryKey: 'year',
      optionKeys: ['COMMON.YEARS.CURRENT', 'COMMON.YEARS.LAST']
    },
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      optionKeys: ['PAGES.LEAVE.OPTIONS.ANNUAL', 'PAGES.LEAVE.OPTIONS.SICK']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.REPORTS.LEAVE.COLUMNS.EMPLOYEE',
    'PAGES.REPORTS.LEAVE.COLUMNS.TYPE',
    'PAGES.REPORTS.LEAVE.COLUMNS.DAYS_USED',
    'PAGES.REPORTS.LEAVE.COLUMNS.STATUS'
  ];
}
