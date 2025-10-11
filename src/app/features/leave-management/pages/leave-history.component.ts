import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="leave-management"
      pageKey="history"
      pageTitleKey="PAGES.LEAVE.HISTORY.TITLE"
      pageSubtitleKey="PAGES.LEAVE.HISTORY.SUBTITLE"
      contentTitleKey="PAGES.LEAVE.HISTORY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.LEAVE.HISTORY.CONTENT_SUBTITLE"
      todoKey="PAGES.LEAVE.HISTORY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveHistoryComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.YEAR',
      type: 'select',
      queryKey: 'year',
      options: [
        { labelKey: 'COMMON.YEARS.CURRENT', value: '2025' },
        { labelKey: 'COMMON.YEARS.LAST', value: '2024' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.APPROVED', value: 'Approved' },
        { labelKey: 'COMMON.STATUSES.REJECTED', value: 'Rejected' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.HISTORY.COLUMNS.REFERENCE',
    'PAGES.LEAVE.HISTORY.COLUMNS.TYPE',
    'PAGES.LEAVE.HISTORY.COLUMNS.PERIOD',
    'PAGES.LEAVE.HISTORY.COLUMNS.DAY_USED',
    'PAGES.LEAVE.HISTORY.COLUMNS.STATUS'
  ];
}
