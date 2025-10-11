import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="settings"
      pageKey="notifications"
      pageTitleKey="PAGES.SETTINGS.NOTIFICATIONS.TITLE"
      pageSubtitleKey="PAGES.SETTINGS.NOTIFICATIONS.SUBTITLE"
      contentTitleKey="PAGES.SETTINGS.NOTIFICATIONS.CONTENT_TITLE"
      contentSubtitleKey="PAGES.SETTINGS.NOTIFICATIONS.CONTENT_SUBTITLE"
      todoKey="PAGES.SETTINGS.NOTIFICATIONS.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.SETTINGS.NOTIFICATIONS.ACTIONS.SAVE', icon: 'save', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.NOTIFICATIONS.FIELDS.CHANNEL',
      type: 'select',
      queryKey: 'channel',
      optionKeys: ['PAGES.SETTINGS.NOTIFICATIONS.CHANNELS.EMAIL', 'PAGES.SETTINGS.NOTIFICATIONS.CHANNELS.SMS', 'PAGES.SETTINGS.NOTIFICATIONS.CHANNELS.IN_APP']
    },
    {
      labelKey: 'PAGES.SETTINGS.NOTIFICATIONS.FIELDS.FREQUENCY',
      type: 'select',
      queryKey: 'frequency',
      optionKeys: ['PAGES.SETTINGS.NOTIFICATIONS.FREQUENCIES.REALTIME', 'PAGES.SETTINGS.NOTIFICATIONS.FREQUENCIES.DAILY', 'PAGES.SETTINGS.NOTIFICATIONS.FREQUENCIES.WEEKLY']
    }
  ];
}
