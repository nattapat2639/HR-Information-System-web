import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="settings"
      pageKey="security"
      pageTitleKey="PAGES.SETTINGS.SECURITY.TITLE"
      pageSubtitleKey="PAGES.SETTINGS.SECURITY.SUBTITLE"
      contentTitleKey="PAGES.SETTINGS.SECURITY.CONTENT_TITLE"
      contentSubtitleKey="PAGES.SETTINGS.SECURITY.CONTENT_SUBTITLE"
      todoKey="PAGES.SETTINGS.SECURITY.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.SAVE', icon: 'save', variant: 'primary' },
    { labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.ENFORCE', icon: 'verified_user', variant: 'secondary' },
    { labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.RUN_AUDIT', icon: 'manage_search', variant: 'ghost' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.FIELDS.MFA',
      type: 'select',
      queryKey: 'mfa',
      optionKeys: ['PAGES.SETTINGS.SECURITY.MFA.REQUIRED', 'PAGES.SETTINGS.SECURITY.MFA.OPTIONAL']
    },
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.FIELDS.PASSWORD_POLICY',
      type: 'select',
      queryKey: 'passwordPolicy',
      optionKeys: ['PAGES.SETTINGS.SECURITY.PASSWORD_POLICY.STANDARD', 'PAGES.SETTINGS.SECURITY.PASSWORD_POLICY.STRICT']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.SETTINGS.SECURITY.COLUMNS.CONTROL',
    'PAGES.SETTINGS.SECURITY.COLUMNS.STATUS',
    'PAGES.SETTINGS.SECURITY.COLUMNS.LAST_REVIEW',
    'PAGES.SETTINGS.SECURITY.COLUMNS.OWNER'
  ];
}
