import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="leave-management"
      pageKey="my"
      pageTitleKey="PAGES.LEAVE.MY.TITLE"
      pageSubtitleKey="PAGES.LEAVE.MY.SUBTITLE"
      contentTitleKey="PAGES.LEAVE.MY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.LEAVE.MY.CONTENT_SUBTITLE"
      todoKey="PAGES.LEAVE.MY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveListComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.LEAVE.MY.ACTIONS.CREATE', icon: 'add_circle', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.UNPAID', value: 'Unpaid Leave' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.PENDING', value: 'Pending' },
        { labelKey: 'COMMON.STATUSES.APPROVED', value: 'Approved' },
        { labelKey: 'COMMON.STATUSES.REJECTED', value: 'Rejected' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.START_DATE',
      type: 'date',
      queryKey: 'startDate'
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.MY.COLUMNS.REFERENCE',
    'PAGES.LEAVE.MY.COLUMNS.TYPE',
    'PAGES.LEAVE.MY.COLUMNS.START',
    'PAGES.LEAVE.MY.COLUMNS.END',
    'PAGES.LEAVE.MY.COLUMNS.STATUS'
  ];
}
