import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="settings"
      pageKey="system"
      pageTitleKey="PAGES.SETTINGS.SYSTEM.TITLE"
      pageSubtitleKey="PAGES.SETTINGS.SYSTEM.SUBTITLE"
      contentTitleKey="PAGES.SETTINGS.SYSTEM.CONTENT_TITLE"
      contentSubtitleKey="PAGES.SETTINGS.SYSTEM.CONTENT_SUBTITLE"
      todoKey="PAGES.SETTINGS.SYSTEM.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemConfigComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.SETTINGS.SYSTEM.ACTIONS.SAVE', icon: 'save', variant: 'primary' },
    { labelKey: 'PAGES.SETTINGS.SYSTEM.ACTIONS.RESET_DEFAULT', icon: 'restart_alt', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.FIELDS.TIMEZONE',
      type: 'select',
      queryKey: 'timezone',
      optionKeys: ['PAGES.SETTINGS.SYSTEM.TIMEZONES.BKK', 'PAGES.SETTINGS.SYSTEM.TIMEZONES.UTC']
    },
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.FIELDS.WORKWEEK',
      type: 'select',
      queryKey: 'workweek',
      optionKeys: ['PAGES.SETTINGS.SYSTEM.WORKWEEKS.STANDARD', 'PAGES.SETTINGS.SYSTEM.WORKWEEKS.CUSTOM']
    }
  ];
}
