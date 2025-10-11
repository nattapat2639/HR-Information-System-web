import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="employee-records"
      pageKey="profile"
      pageTitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE"
      pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.SUBTITLE"
      contentTitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.CONTENT_SUBTITLE"
      todoKey="PAGES.EMPLOYEE_RECORDS.PROFILE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.EDIT', icon: 'edit', variant: 'primary' },
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.DOWNLOAD', icon: 'download', variant: 'secondary' },
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.MORE', icon: 'more_horiz', variant: 'ghost' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.EMPLOYEE_ID',
      type: 'text',
      placeholderKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.PLACEHOLDER.EMPLOYEE_ID',
      queryKey: 'employeeId'
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      options: [
        { labelKey: 'COMMON.DEPARTMENTS.HR', value: 'People Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.IT', value: 'Technology' },
        { labelKey: 'COMMON.DEPARTMENTS.FINANCE', value: 'Finance' }
      ]
    }
  ];
}
