import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';

@Component({
  selector: 'app-employee-records-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        moduleKey="employee-records"
        pageKey="all"
        pageTitleKey="PAGES.EMPLOYEE_RECORDS.LIST.TITLE"
        pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.LIST.SUBTITLE"
        contentTitleKey="PAGES.EMPLOYEE_RECORDS.LIST.CONTENT_TITLE"
        contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.LIST.CONTENT_SUBTITLE"
        todoKey="PAGES.EMPLOYEE_RECORDS.LIST.TODO"
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
export class EmployeeRecordsPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.LIST.ACTIONS.ADD', icon: 'person_add', variant: 'primary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.NAME',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.SEARCH_NAME',
      queryKey: 'name'
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      options: [
        { labelKey: 'COMMON.DEPARTMENTS.HR', value: 'People Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.IT', value: 'Technology' },
        { labelKey: 'COMMON.DEPARTMENTS.FINANCE', value: 'Finance' },
        { value: 'Marketing' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.ACTIVE', value: 'Active' },
        { value: 'On Leave' },
        { value: 'Probation' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.EMPLOYEE_ID',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.NAME',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.POSITION',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.DEPARTMENT',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.STATUS',
    'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.LAST_EVENT'
  ];

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.actionsService
      .exportAll(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('employee-register.csv', blob);
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
