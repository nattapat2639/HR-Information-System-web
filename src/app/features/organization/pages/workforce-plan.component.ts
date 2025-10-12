import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-workforce-plan',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="organization"
      pageKey="workforce-plan"
      pageTitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.TITLE"
      pageSubtitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.SUBTITLE"
      contentTitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.CONTENT_TITLE"
      contentSubtitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.CONTENT_SUBTITLE"
      todoKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
      exportLabelKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.EXPORT"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkforcePlanComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.EXPORT', icon: 'download', variant: 'secondary' },
    { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.PUBLISH', icon: 'publish', variant: 'primary' },
    { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.REQUEST', icon: 'group_add', variant: 'ghost' }
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
    },
    {
      labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.FILTERS.ATTRITION',
      type: 'select',
      queryKey: 'attrition',
      options: [
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.LOW', value: 'Low' },
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.MEDIUM', value: 'Medium' },
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.HIGH', value: 'High' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.DEPARTMENT',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.CURRENT_HEADCOUNT',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.APPROVED_Q3',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.ATTRITION_RISK',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.NEXT_HIRE'
  ];
}
