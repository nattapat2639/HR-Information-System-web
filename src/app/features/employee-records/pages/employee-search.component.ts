import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        moduleKey="employee-records"
        pageKey="search"
        pageTitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.TITLE"
        pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.SUBTITLE"
        contentTitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.CONTENT_TITLE"
        contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.SEARCH.CONTENT_SUBTITLE"
        todoKey="PAGES.EMPLOYEE_RECORDS.SEARCH.TODO"
        [actions]="actions"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="true"
        (exportRequested)="onExport($event)"
      ></app-page-layout>
      <div
        *ngIf="successMessage()"
        class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700"
      >
        {{ successMessage() | translate }}
      </div>
      <div
        *ngIf="errorMessage()"
        class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
      >
        {{ errorMessage() | translate }}
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.SEARCH.ACTIONS.SAVE_FILTER', icon: 'bookmark_border', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.KEYWORD',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.ENTER_KEYWORD',
      queryKey: 'keyword'
    },
    {
      labelKey: 'COMMON.FIELDS.LOCATION',
      type: 'select',
      queryKey: 'location',
      options: [
        { labelKey: 'COMMON.LOCATIONS.HQ', value: 'Headquarters' },
        { labelKey: 'COMMON.LOCATIONS.REGIONAL', value: 'Regional offices' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.DATE_RANGE',
      type: 'date',
      queryKey: 'date'
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.EMPLOYEE_ID',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.NAME',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.DEPARTMENT',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.LEVEL',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.STATUS',
    'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.EVENT'
  ];

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.actionsService
      .exportSearch(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('employee-search-results.csv', blob);
          this.successMessage.set('EMPLOYEE_RECORDS.EXPORT.SUCCESS');
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  private triggerDownload(fileName: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
