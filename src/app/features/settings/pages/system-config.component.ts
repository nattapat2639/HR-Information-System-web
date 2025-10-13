import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterField, PageAction, PageActionEvent, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { SettingsActionsService } from '../settings-actions.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent],
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
export class SystemConfigComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly settingsActions = inject(SettingsActionsService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly actions: PageAction[] = [
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.ACTIONS.SAVE',
      icon: 'save',
      variant: 'primary',
      actionKey: 'save-system'
    },
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.ACTIONS.SYNC',
      icon: 'sync',
      variant: 'secondary',
      actionKey: 'sync-system'
    },
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.ACTIONS.RESET_DEFAULT',
      icon: 'restart_alt',
      variant: 'ghost',
      actionKey: 'reset-system'
    }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.FIELDS.TIMEZONE',
      type: 'select',
      queryKey: 'timezone',
      options: [
        { labelKey: 'PAGES.SETTINGS.SYSTEM.TIMEZONES.BKK', value: '(UTC+07:00) Bangkok' },
        { labelKey: 'PAGES.SETTINGS.SYSTEM.TIMEZONES.UTC', value: '(UTC) Coordinated Universal Time' }
      ]
    },
    {
      labelKey: 'PAGES.SETTINGS.SYSTEM.FIELDS.WORKWEEK',
      type: 'select',
      queryKey: 'workweek',
      options: [
        { labelKey: 'PAGES.SETTINGS.SYSTEM.WORKWEEKS.STANDARD', value: 'Mon-Fri, 09:00-18:00' },
        { labelKey: 'PAGES.SETTINGS.SYSTEM.WORKWEEKS.CUSTOM', value: 'Custom schedule' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.SETTINGS.SYSTEM.COLUMNS.CONFIGURATION',
    'PAGES.SETTINGS.SYSTEM.COLUMNS.VALUE',
    'PAGES.SETTINGS.SYSTEM.COLUMNS.OWNER',
    'PAGES.SETTINGS.SYSTEM.COLUMNS.UPDATED'
  ];

  protected onAction(event: PageActionEvent): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    switch (event.action.actionKey) {
      case 'save-system':
        this.settingsActions
          .updateSystemConfiguration({
            primaryTimezone: event.filters['timezone'],
            workweekTemplate: event.filters['workweek']
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SYSTEM.UPDATE_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'sync-system':
        this.settingsActions
          .syncSystemConfiguration()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SYSTEM.SYNC_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'reset-system':
        this.settingsActions
          .resetSystemConfiguration()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'SETTINGS.SYSTEM.RESET_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }
}
