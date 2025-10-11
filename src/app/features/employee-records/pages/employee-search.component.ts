import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="employee-records"
      pageKey="search"
      pageTitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.TITLE"
      pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.SUBTITLE"
      contentTitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.CONTENT_TITLE"
      contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.CONTENT_SUBTITLE"
      todoKey="PAGES.EMPLOYEE_RECORDS.SEARCH.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.SEARCH.ACTIONS.SAVE_FILTER', icon: 'bookmark_border', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.KEYWORD',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.ENTER_KEYWORD',
      queryKey: 'keyword'
    },
    {
      labelKey: 'COMMON.FIELDS.LOCATION',
      type: 'select',
      queryKey: 'location',
      options: [
        { labelKey: 'COMMON.LOCATIONS.HQ', value: 'Headquarters' },
        { labelKey: 'COMMON.LOCATIONS.REGIONAL', value: 'Regional offices' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.DATE_RANGE',
      type: 'date',
      queryKey: 'date'
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.EMPLOYEE_ID',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.NAME',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.DEPARTMENT',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.LEVEL'
  ];
}
