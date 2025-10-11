import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-training-calendar',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="training"
      pageKey="calendar"
      pageTitleKey="PAGES.TRAINING.CALENDAR.TITLE"
      pageSubtitleKey="PAGES.TRAINING.CALENDAR.SUBTITLE"
      contentTitleKey="PAGES.TRAINING.CALENDAR.CONTENT_TITLE"
      contentSubtitleKey="PAGES.TRAINING.CALENDAR.CONTENT_SUBTITLE"
      todoKey="PAGES.TRAINING.CALENDAR.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingCalendarComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.TRAINING.CALENDAR.ACTIONS.SYNC_CALENDAR', icon: 'event_available', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.MONTH',
      type: 'select',
      queryKey: 'month',
      optionKeys: ['COMMON.MONTHS.CURRENT', 'COMMON.MONTHS.NEXT']
    },
    {
      labelKey: 'COMMON.FIELDS.CATEGORY',
      type: 'select',
      queryKey: 'category',
      optionKeys: ['PAGES.TRAINING.CATEGORIES.TECHNICAL', 'PAGES.TRAINING.CATEGORIES.SOFT_SKILL']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.TRAINING.CALENDAR.COLUMNS.SESSION',
    'PAGES.TRAINING.CALENDAR.COLUMNS.DATE',
    'PAGES.TRAINING.CALENDAR.COLUMNS.TRAINER',
    'PAGES.TRAINING.CALENDAR.COLUMNS.STATUS'
  ];
}
