import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-training-progress',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="training"
      pageKey="progress"
      pageTitleKey="PAGES.TRAINING.PROGRESS.TITLE"
      pageSubtitleKey="PAGES.TRAINING.PROGRESS.SUBTITLE"
      contentTitleKey="PAGES.TRAINING.PROGRESS.CONTENT_TITLE"
      contentSubtitleKey="PAGES.TRAINING.PROGRESS.CONTENT_SUBTITLE"
      todoKey="PAGES.TRAINING.PROGRESS.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingProgressComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.TRAINING.PROGRESS.ACTIONS.VIEW_CERTIFICATES', icon: 'workspace_premium', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.YEAR',
      type: 'select',
      queryKey: 'year',
      optionKeys: ['COMMON.YEARS.CURRENT', 'COMMON.YEARS.LAST']
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.COMPLETED', 'COMMON.STATUSES.IN_PROGRESS']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.TRAINING.PROGRESS.COLUMNS.PROGRAM',
    'PAGES.TRAINING.PROGRESS.COLUMNS.START_DATE',
    'PAGES.TRAINING.PROGRESS.COLUMNS.END_DATE',
    'PAGES.TRAINING.PROGRESS.COLUMNS.STATUS'
  ];
}
