import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-performance-create',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="performance"
      pageKey="create"
      pageTitleKey="PAGES.PERFORMANCE.CREATE.TITLE"
      pageSubtitleKey="PAGES.PERFORMANCE.CREATE.SUBTITLE"
      contentTitleKey="PAGES.PERFORMANCE.CREATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.PERFORMANCE.CREATE.CONTENT_SUBTITLE"
      todoKey="PAGES.PERFORMANCE.CREATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceCreateComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.PERFORMANCE.CREATE.ACTIONS.SAVE', icon: 'save', variant: 'primary' },
    { labelKey: 'PAGES.PERFORMANCE.CREATE.ACTIONS.PUBLISH', icon: 'send', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.TEMPLATE',
      type: 'select',
      queryKey: 'template',
      optionKeys: ['PAGES.PERFORMANCE.CREATE.TEMPLATES.STANDARD', 'PAGES.PERFORMANCE.CREATE.TEMPLATES.CUSTOM']
    },
    {
      labelKey: 'COMMON.FIELDS.PERIOD',
      type: 'select',
      queryKey: 'period',
      optionKeys: ['COMMON.PERIODS.CURRENT_YEAR', 'COMMON.PERIODS.NEXT_YEAR']
    }
  ];
}
