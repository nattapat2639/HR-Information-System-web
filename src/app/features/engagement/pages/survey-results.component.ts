import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-survey-results',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="engagement"
      pageKey="results"
      pageTitleKey="PAGES.ENGAGEMENT.RESULTS.TITLE"
      pageSubtitleKey="PAGES.ENGAGEMENT.RESULTS.SUBTITLE"
      contentTitleKey="PAGES.ENGAGEMENT.RESULTS.CONTENT_TITLE"
      contentSubtitleKey="PAGES.ENGAGEMENT.RESULTS.CONTENT_SUBTITLE"
      todoKey="PAGES.ENGAGEMENT.RESULTS.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyResultsComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.ENGAGEMENT.RESULTS.ACTIONS.EXPORT', icon: 'file_download', variant: 'secondary' },
    { labelKey: 'PAGES.ENGAGEMENT.RESULTS.ACTIONS.SHARE', icon: 'share', variant: 'ghost' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.SURVEY',
      type: 'select',
      queryKey: 'survey',
      optionKeys: ['PAGES.ENGAGEMENT.RESULTS.OPTIONS.LATEST', 'PAGES.ENGAGEMENT.RESULTS.OPTIONS.CUSTOM']
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      optionKeys: ['COMMON.DEPARTMENTS.HR', 'COMMON.DEPARTMENTS.IT', 'COMMON.DEPARTMENTS.FINANCE']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ENGAGEMENT.RESULTS.COLUMNS.METRIC',
    'PAGES.ENGAGEMENT.RESULTS.COLUMNS.SCORE',
    'PAGES.ENGAGEMENT.RESULTS.COLUMNS.TREND'
  ];
}
