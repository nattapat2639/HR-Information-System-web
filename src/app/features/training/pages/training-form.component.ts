import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="training"
      pageKey="create"
      pageTitleKey="PAGES.TRAINING.CREATE.TITLE"
      pageSubtitleKey="PAGES.TRAINING.CREATE.SUBTITLE"
      contentTitleKey="PAGES.TRAINING.CREATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.TRAINING.CREATE.CONTENT_SUBTITLE"
      todoKey="PAGES.TRAINING.CREATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingFormComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.TRAINING.CREATE.ACTIONS.SAVE', icon: 'save', variant: 'primary' },
    { labelKey: 'PAGES.TRAINING.CREATE.ACTIONS.PUBLISH', icon: 'send', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    { labelKey: 'PAGES.TRAINING.CREATE.FIELDS.TITLE', type: 'text', placeholderKey: 'PAGES.TRAINING.CREATE.PLACEHOLDER.TITLE' },
    { labelKey: 'PAGES.TRAINING.CREATE.FIELDS.CATEGORY', type: 'select', optionKeys: ['PAGES.TRAINING.CATEGORIES.TECHNICAL', 'PAGES.TRAINING.CATEGORIES.SOFT_SKILL'] },
    { labelKey: 'PAGES.TRAINING.CREATE.FIELDS.START_DATE', type: 'date' }
  ];
}
