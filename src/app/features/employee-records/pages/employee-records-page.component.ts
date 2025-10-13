import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FilterField, PageAction, PageLayoutComponent, PageRowActionEvent, PageSelectionChangeEvent } from '../../../shared/components/page-layout/page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import { EmployeeProfileViewComponent } from '../components/employee-profile-view.component';
import { EmployeeProfile } from '../models/employee-profile.model';

@Component({
  selector: 'app-employee-records-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, EmployeeProfileViewComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        #layout
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
        [enableSelection]="true"
        [selectionKey]="selectionKey"
        (filtersChanged)="onFiltersChanged($event)"
        (exportRequested)="onExport($event)"
        (rowActionTriggered)="onRowAction($event)"
        (selectionChanged)="onSelectionChanged($event)"
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
      <div
        *ngIf="selectedEmployeeIds().length > 0"
        class="card card-padding flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-700">
          {{ 'PAGES.EMPLOYEE_RECORDS.LIST.SELECTION.COUNT' | translate:{ count: selectedEmployeeIds().length } }}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="exportSelected()"
          >
            <span class="material-icons text-[16px]">file_download</span>
            {{ 'PAGES.EMPLOYEE_RECORDS.LIST.SELECTION.EXPORT' | translate }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="clearSelection()"
          >
            <span class="material-icons text-[16px]">clear</span>
            {{ 'PAGES.EMPLOYEE_RECORDS.LIST.SELECTION.CLEAR' | translate }}
          </button>
        </div>
      </div>
    </section>

    <div
      *ngIf="profileDrawerOpen()"
      class="fixed inset-0 z-30 flex"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE' | translate"
    >
      <div class="absolute inset-0 bg-gray-900/60" (click)="closeProfileDrawer()" aria-hidden="true"></div>
      <aside class="relative ml-auto flex h-full w-full max-w-3xl flex-col bg-white shadow-xl">
        <header class="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE' | translate }}
            </p>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ profileDrawerName() || ('COMMON.SELECT.PLACEHOLDER' | translate) }}
              <span *ngIf="profileDrawerEmployeeNumber()" class="text-sm font-normal text-gray-500">
                ({{ profileDrawerEmployeeNumber() }})
              </span>
            </h2>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="closeProfileDrawer()"
          >
            <span class="material-icons text-[20px]">close</span>
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <app-employee-profile-view
            [profile]="profileDrawerData()"
            [loading]="profileDrawerLoading()"
            [errorMessage]="profileDrawerError()"
          ></app-employee-profile-view>
        </div>
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRecordsPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);
  @ViewChild('layout') private layout?: PageLayoutComponent;

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedEmployeeIds = signal<string[]>([]);
  protected readonly currentFilters = signal<Record<string, string>>({});
  protected readonly selectionKey = 'PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.EMPLOYEE_ID';
  protected readonly profileDrawerOpen = signal(false);
  protected readonly profileDrawerLoading = signal(false);
  protected readonly profileDrawerData = signal<EmployeeProfile | null>(null);
  protected readonly profileDrawerError = signal<string | null>(null);
  protected readonly profileDrawerName = signal<string>('');
  protected readonly profileDrawerEmployeeNumber = signal<string | null>(null);

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

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.currentFilters.set(filters);
  }

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.currentFilters.set(filters);
    const selected = this.selectedEmployeeIds();

    this.actionsService
      .exportAll(filters, selected.length > 0 ? selected : [])
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

  protected onRowAction(event: PageRowActionEvent): void {
    if (event.action.actionKey !== 'view-profile') {
      return;
    }

    const employeeNumber = event.row.columns['PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.EMPLOYEE_ID'];
    const name =
      event.row.columns['PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.NAME'] ??
      event.row.columns['PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.NAME'] ??
      '';
    if (!employeeNumber) {
      return;
    }

    this.openProfileDrawer(employeeNumber, name);
  }

  protected onSelectionChanged(event: PageSelectionChangeEvent): void {
    this.selectedEmployeeIds.set(event.keys);
  }

  protected exportSelected(): void {
    const keys = this.selectedEmployeeIds();
    if (keys.length === 0) {
      return;
    }

    this.actionsService
      .exportAll(this.currentFilters(), keys)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('employee-register-selected.csv', blob);
          this.successMessage.set('EMPLOYEE_RECORDS.EXPORT.SUCCESS');
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  protected clearSelection(): void {
    this.layout?.clearSelection();
  }

  protected closeProfileDrawer(): void {
    this.profileDrawerOpen.set(false);
    this.profileDrawerData.set(null);
    this.profileDrawerError.set(null);
    this.profileDrawerEmployeeNumber.set(null);
    this.profileDrawerName.set('');
    this.profileDrawerLoading.set(false);
  }

  private openProfileDrawer(employeeNumber: string, displayName: string): void {
    this.profileDrawerOpen.set(true);
    this.profileDrawerLoading.set(true);
    this.profileDrawerError.set(null);
    this.profileDrawerData.set(null);
    this.profileDrawerEmployeeNumber.set(employeeNumber);
    this.profileDrawerName.set(displayName);

    this.actionsService
      .getProfile(employeeNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profileDrawerData.set(profile);
          this.profileDrawerLoading.set(false);
        },
        error: () => {
          this.profileDrawerError.set('COMMON.ERROR.LOAD_FAILED');
          this.profileDrawerLoading.set(false);
        }
      });
  }
}
