import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-employee-report',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="reports"
      pageKey="employee"
      pageTitleKey="PAGES.REPORTS.EMPLOYEE.TITLE"
      pageSubtitleKey="PAGES.REPORTS.EMPLOYEE.SUBTITLE"
      contentTitleKey="PAGES.REPORTS.EMPLOYEE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.REPORTS.EMPLOYEE.CONTENT_SUBTITLE"
      todoKey="PAGES.REPORTS.EMPLOYEE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeReportComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.REPORTS.ACTIONS.RUN', icon: 'play_arrow', variant: 'primary' },
    { labelKey: 'COMMON.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      optionKeys: ['COMMON.DEPARTMENTS.HR', 'COMMON.DEPARTMENTS.IT', 'COMMON.DEPARTMENTS.FINANCE']
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.ACTIVE', 'COMMON.STATUSES.INACTIVE']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.REPORTS.EMPLOYEE.COLUMNS.EMPLOYEE_ID',
    'PAGES.REPORTS.EMPLOYEE.COLUMNS.NAME',
    'PAGES.REPORTS.EMPLOYEE.COLUMNS.DEPARTMENT',
    'PAGES.REPORTS.EMPLOYEE.COLUMNS.STATUS'
  ];
}
