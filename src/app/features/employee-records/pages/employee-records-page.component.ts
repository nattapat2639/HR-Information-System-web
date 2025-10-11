import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-employee-records-page',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="employee-records"
      pageKey="all"
      pageTitleKey="PAGES.EMPLOYEE_RECORDS.LIST.TITLE"
      pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.LIST.SUBTITLE"
      contentTitleKey="PAGES.EMPLOYEE_RECORDS.LIST.CONTENT_TITLE"
      contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.LIST.CONTENT_SUBTITLE"
      todoKey="PAGES.EMPLOYEE_RECORDS.LIST.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRecordsPageComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.LIST.ACTIONS.ADD', icon: 'person_add', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.NAME',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.SEARCH_NAME',
      queryKey: 'name'
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      options: [
        { labelKey: 'COMMON.DEPARTMENTS.HR', value: 'People Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.IT', value: 'Technology' },
        { labelKey: 'COMMON.DEPARTMENTS.FINANCE', value: 'Finance' },
        { value: 'Marketing' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.ACTIVE', value: 'Active' },
        { value: 'On Leave' },
        { value: 'Probation' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.EMPLOYEE_ID',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.NAME',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.POSITION',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.DEPARTMENT',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.STATUS'
  ];
}
