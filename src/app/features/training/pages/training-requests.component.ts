import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-training-requests',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="training"
      pageKey="requests"
      pageTitleKey="PAGES.TRAINING.REQUESTS.TITLE"
      pageSubtitleKey="PAGES.TRAINING.REQUESTS.SUBTITLE"
      contentTitleKey="PAGES.TRAINING.REQUESTS.CONTENT_TITLE"
      contentSubtitleKey="PAGES.TRAINING.REQUESTS.CONTENT_SUBTITLE"
      todoKey="PAGES.TRAINING.REQUESTS.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingRequestsComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.TRAINING.REQUESTS.ACTIONS.CREATE', icon: 'add_circle', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.APPROVED', 'COMMON.STATUSES.PENDING']
    },
    {
      labelKey: 'COMMON.FIELDS.CATEGORY',
      type: 'select',
      queryKey: 'category',
      optionKeys: ['PAGES.TRAINING.CATEGORIES.TECHNICAL', 'PAGES.TRAINING.CATEGORIES.SOFT_SKILL']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.TRAINING.REQUESTS.COLUMNS.REQUESTED_BY',
    'PAGES.TRAINING.REQUESTS.COLUMNS.PROGRAM',
    'PAGES.TRAINING.REQUESTS.COLUMNS.SUBMITTED_ON',
    'PAGES.TRAINING.REQUESTS.COLUMNS.STATUS'
  ];
}
