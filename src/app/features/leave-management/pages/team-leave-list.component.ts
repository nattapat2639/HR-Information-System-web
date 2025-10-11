import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-team-leave-list',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="leave-management"
      pageKey="team"
      pageTitleKey="PAGES.LEAVE.TEAM.TITLE"
      pageSubtitleKey="PAGES.LEAVE.TEAM.SUBTITLE"
      contentTitleKey="PAGES.LEAVE.TEAM.CONTENT_TITLE"
      contentSubtitleKey="PAGES.LEAVE.TEAM.CONTENT_SUBTITLE"
      todoKey="PAGES.LEAVE.TEAM.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamLeaveListComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.LEAVE.TEAM.ACTIONS.APPROVE_SELECTED', icon: 'check_circle', variant: 'primary' },
    { labelKey: 'PAGES.LEAVE.TEAM.ACTIONS.REJECT_SELECTED', icon: 'highlight_off', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.EMPLOYEE',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.SEARCH_EMPLOYEE',
      queryKey: 'employee'
    },
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' },
        { value: 'Work From Home' }
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
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.TEAM.COLUMNS.EMPLOYEE',
    'PAGES.LEAVE.TEAM.COLUMNS.TYPE',
    'PAGES.LEAVE.TEAM.COLUMNS.PERIOD',
    'PAGES.LEAVE.TEAM.COLUMNS.STATUS',
    'PAGES.LEAVE.TEAM.COLUMNS.REQUESTED_ON'
  ];
}
