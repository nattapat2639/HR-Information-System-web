import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterField, PageAction, PageActionEvent, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { SettingsActionsService } from '../settings-actions.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent],
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
      (actionTriggered)="onAction($event)"
    ></app-page-layout>
    <div *ngIf="successMessage()" class="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
      {{ successMessage() | translate }}
    </div>
    <div *ngIf="errorMessage()" class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
      {{ errorMessage() | translate }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecuritySettingsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly settingsActions = inject(SettingsActionsService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly actions: PageAction[] = [
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.SAVE',
      icon: 'save',
      variant: 'primary',
      actionKey: 'save-security'
    },
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.ENFORCE',
      icon: 'verified_user',
      variant: 'secondary',
      actionKey: 'enforce-security'
    },
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.ACTIONS.RUN_AUDIT',
      icon: 'manage_search',
      variant: 'ghost',
      actionKey: 'run-security-audit'
    }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.FIELDS.MFA',
      type: 'select',
      queryKey: 'mfa',
      options: [
        { labelKey: 'PAGES.SETTINGS.SECURITY.MFA.REQUIRED', value: 'Enforced' },
        { labelKey: 'PAGES.SETTINGS.SECURITY.MFA.OPTIONAL', value: 'Optional' }
      ]
    },
    {
      labelKey: 'PAGES.SETTINGS.SECURITY.FIELDS.PASSWORD_POLICY',
      type: 'select',
      queryKey: 'passwordPolicy',
      options: [
        { labelKey: 'PAGES.SETTINGS.SECURITY.PASSWORD_POLICY.STANDARD', value: 'Standard' },
        { labelKey: 'PAGES.SETTINGS.SECURITY.PASSWORD_POLICY.STRICT', value: 'Strict' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.SETTINGS.SECURITY.COLUMNS.CONTROL',
    'PAGES.SETTINGS.SECURITY.COLUMNS.STATUS',
    'PAGES.SETTINGS.SECURITY.COLUMNS.LAST_REVIEW',
    'PAGES.SETTINGS.SECURITY.COLUMNS.OWNER'
  ];

  protected onAction(event: PageActionEvent): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    switch (event.action.actionKey) {
      case 'save-security':
        this.settingsActions
          .updateSecurityControls([
            {
              control: 'Multi-factor authentication',
              status: event.filters['mfa'] ?? 'Enforced',
              owner: 'Security Office',
              severity: 'High'
            },
            {
              control: 'Password policy',
              status: event.filters['passwordPolicy'] ?? 'Standard',
              owner: 'Security Office',
              severity: 'High'
            }
          ])
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SECURITY.UPDATE_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'enforce-security':
        this.settingsActions
          .enforceSecurityPolicies()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SECURITY.ENFORCE_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'run-security-audit':
        this.settingsActions
          .runSecurityAudit()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SECURITY.AUDIT_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }
}
