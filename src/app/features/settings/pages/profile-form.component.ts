import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="settings"
      pageKey="profile"
      pageTitleKey="PAGES.SETTINGS.PROFILE.TITLE"
      pageSubtitleKey="PAGES.SETTINGS.PROFILE.SUBTITLE"
      contentTitleKey="PAGES.SETTINGS.PROFILE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.SETTINGS.PROFILE.CONTENT_SUBTITLE"
      todoKey="PAGES.SETTINGS.PROFILE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.SETTINGS.PROFILE.ACTIONS.SAVE', icon: 'save', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.PROFILE.FIELDS.FIRST_NAME',
      type: 'text',
      placeholderKey: 'PAGES.SETTINGS.PROFILE.PLACEHOLDER.FIRST_NAME',
      queryKey: 'firstName'
    },
    {
      labelKey: 'PAGES.SETTINGS.PROFILE.FIELDS.LAST_NAME',
      type: 'text',
      placeholderKey: 'PAGES.SETTINGS.PROFILE.PLACEHOLDER.LAST_NAME',
      queryKey: 'lastName'
    },
    {
      labelKey: 'PAGES.SETTINGS.PROFILE.FIELDS.PHONE',
      type: 'text',
      placeholderKey: 'PAGES.SETTINGS.PROFILE.PLACEHOLDER.PHONE',
      queryKey: 'phone'
    }
  ];
}
