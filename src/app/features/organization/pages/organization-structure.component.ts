import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-organization-structure',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="organization"
      pageKey="structure"
      pageTitleKey="PAGES.ORGANIZATION.STRUCTURE.TITLE"
      pageSubtitleKey="PAGES.ORGANIZATION.STRUCTURE.SUBTITLE"
      contentTitleKey="PAGES.ORGANIZATION.STRUCTURE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.ORGANIZATION.STRUCTURE.CONTENT_SUBTITLE"
      todoKey="PAGES.ORGANIZATION.STRUCTURE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
      exportLabelKey="PAGES.ORGANIZATION.STRUCTURE.ACTIONS.EXPORT"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationStructureComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.ORGANIZATION.STRUCTURE.ACTIONS.EXPORT', icon: 'download', variant: 'secondary' },
    { labelKey: 'PAGES.ORGANIZATION.STRUCTURE.ACTIONS.UPDATE', icon: 'edit', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      optionKeys: [
        'COMMON.DEPARTMENTS.ALL',
        'COMMON.DEPARTMENTS.HR',
        'COMMON.DEPARTMENTS.IT',
        'COMMON.DEPARTMENTS.FINANCE',
        'COMMON.DEPARTMENTS.MARKETING',
        'COMMON.DEPARTMENTS.CUSTOMER_SUCCESS',
        'COMMON.DEPARTMENTS.OPERATIONS',
        'COMMON.DEPARTMENTS.SALES',
        'COMMON.DEPARTMENTS.DATA_ANALYTICS'
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.DEPARTMENT',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.LEAD',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.HEADCOUNT',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.OPEN_ROLES',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.FOCUS'
  ];
}
