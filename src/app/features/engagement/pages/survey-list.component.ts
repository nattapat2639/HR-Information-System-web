import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="engagement"
      pageKey="surveys"
      pageTitleKey="PAGES.ENGAGEMENT.SURVEYS.TITLE"
      pageSubtitleKey="PAGES.ENGAGEMENT.SURVEYS.SUBTITLE"
      contentTitleKey="PAGES.ENGAGEMENT.SURVEYS.CONTENT_TITLE"
      contentSubtitleKey="PAGES.ENGAGEMENT.SURVEYS.CONTENT_SUBTITLE"
      todoKey="PAGES.ENGAGEMENT.SURVEYS.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyListComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.ENGAGEMENT.SURVEYS.ACTIONS.NEW_SURVEY', icon: 'add_circle', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.ACTIVE', 'COMMON.STATUSES.CLOSED']
    },
    {
      labelKey: 'COMMON.FIELDS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_QUARTER', 'COMMON.PERIODS.LAST_QUARTER']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ENGAGEMENT.SURVEYS.COLUMNS.TITLE',
    'PAGES.ENGAGEMENT.SURVEYS.COLUMNS.STATUS',
    'PAGES.ENGAGEMENT.SURVEYS.COLUMNS.OPEN_DATE',
    'PAGES.ENGAGEMENT.SURVEYS.COLUMNS.CLOSE_DATE'
  ];
}
