import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="leave-management"
      pageKey="create"
      pageTitleKey="PAGES.LEAVE.CREATE.TITLE"
      pageSubtitleKey="PAGES.LEAVE.CREATE.SUBTITLE"
      contentTitleKey="PAGES.LEAVE.CREATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.LEAVE.CREATE.CONTENT_SUBTITLE"
      todoKey="PAGES.LEAVE.CREATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showResetFilterButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestFormComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.LEAVE.CREATE.ACTIONS.SUBMIT', icon: 'send', variant: 'primary' },
    { labelKey: 'PAGES.LEAVE.CREATE.ACTIONS.SAVE_DRAFT', icon: 'save', variant: 'secondary' }
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
    { labelKey: 'COMMON.FIELDS.START_DATE', type: 'date', queryKey: 'startDate' },
    { labelKey: 'COMMON.FIELDS.END_DATE', type: 'date', queryKey: 'endDate' }
  ];
}
