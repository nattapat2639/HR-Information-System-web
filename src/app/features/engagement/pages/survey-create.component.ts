import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-survey-create',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="engagement"
      pageKey="create"
      pageTitleKey="PAGES.ENGAGEMENT.CREATE.TITLE"
      pageSubtitleKey="PAGES.ENGAGEMENT.CREATE.SUBTITLE"
      contentTitleKey="PAGES.ENGAGEMENT.CREATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.ENGAGEMENT.CREATE.CONTENT_SUBTITLE"
      todoKey="PAGES.ENGAGEMENT.CREATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyCreateComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.ENGAGEMENT.CREATE.ACTIONS.SAVE_DRAFT', icon: 'save', variant: 'secondary' },
    { labelKey: 'PAGES.ENGAGEMENT.CREATE.ACTIONS.PUBLISH', icon: 'publish', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.ENGAGEMENT.CREATE.FIELDS.TITLE',
      type: 'text',
      placeholderKey: 'PAGES.ENGAGEMENT.CREATE.PLACEHOLDER.TITLE',
      queryKey: 'title'
    },
    { labelKey: 'PAGES.ENGAGEMENT.CREATE.FIELDS.OPEN_DATE', type: 'date', queryKey: 'openDate' },
    { labelKey: 'PAGES.ENGAGEMENT.CREATE.FIELDS.CLOSE_DATE', type: 'date', queryKey: 'closeDate' }
  ];
}
