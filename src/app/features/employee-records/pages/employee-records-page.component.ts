import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FilterField,
  PageAction,
  PageActionEvent,
  PageLayoutComponent,
  PageRowActionEvent,
  PageSelectionChangeEvent
} from '../../../shared/components/page-layout/page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import { EmployeeProfileViewComponent } from '../components/employee-profile-view.component';
import { Employee, EmployeeCreateRequest, EmployeeProfile } from '../models/employee-profile.model';

type CreateEmployeeFormGroup = FormGroup<{
  employeeNumber: FormControl<string>;
  fullName: FormControl<string>;
  department: FormControl<string>;
  position: FormControl<string>;
  status: FormControl<string>;
  hiredAt: FormControl<string>;
}>;

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-employee-records-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, PageLayoutComponent, EmployeeProfileViewComponent],
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
        (actionTriggered)="onActionTriggered($event)"
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
      *ngIf="createDrawerOpen()"
      class="fixed inset-0 z-40 flex"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.TITLE' | translate"
    >
      <div class="absolute inset-0 bg-gray-900/60" (click)="closeCreateDrawer()" aria-hidden="true"></div>
      <aside class="relative ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
        <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.TITLE' | translate }}
            </p>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.SUBTITLE' | translate }}
            </h2>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="closeCreateDrawer()"
            [attr.aria-label]="'COMMON.ACTIONS.CLOSE' | translate"
          >
            <span class="material-icons text-[20px]">close</span>
          </button>
        </header>

        <form class="flex-1 overflow-y-auto px-6 py-5 space-y-5" [formGroup]="createForm" (ngSubmit)="submitCreateForm()">
          <div
            *ngIf="createError()"
            class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
          >
            {{ createError() | translate }}
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2 sm:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.EMPLOYEE_NUMBER' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                formControlName="employeeNumber"
                autocomplete="off"
              />
              <p
                *ngIf="createForm.controls.employeeNumber.touched && createForm.controls.employeeNumber.invalid"
                class="text-xs text-red-600"
              >
                {{
                  createForm.controls.employeeNumber.hasError('conflict')
                    ? ('PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.EMPLOYEE_NUMBER_CONFLICT' | translate)
                    : ('PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate)
                }}
              </p>
            </div>

            <div class="space-y-2 sm:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.FULL_NAME' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                formControlName="fullName"
                autocomplete="off"
              />
              <p
                *ngIf="createForm.controls.fullName.touched && createForm.controls.fullName.invalid"
                class="text-xs text-red-600"
              >
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.DEPARTMENT' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <select
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                formControlName="department"
              >
                <option value="">{{ 'COMMON.SELECT.PLACEHOLDER' | translate }}</option>
                <option *ngFor="let option of departmentOptions" [value]="option.value">
                  {{ option.labelKey ? (option.labelKey | translate) : option.value }}
                </option>
              </select>
              <p
                *ngIf="createForm.controls.department.touched && createForm.controls.department.invalid"
                class="text-xs text-red-600"
              >
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.POSITION' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                formControlName="position"
                autocomplete="off"
              />
              <p
                *ngIf="createForm.controls.position.touched && createForm.controls.position.invalid"
                class="text-xs text-red-600"
              >
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.STATUS' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <select
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                formControlName="status"
              >
                <option value="">{{ 'COMMON.SELECT.PLACEHOLDER' | translate }}</option>
                <option *ngFor="let option of statusOptions" [value]="option.value">
                  {{ option.labelKey ? (option.labelKey | translate) : option.value }}
                </option>
              </select>
              <p
                *ngIf="createForm.controls.status.touched && createForm.controls.status.invalid"
                class="text-xs text-red-600"
              >
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.FIELDS.HIRED_AT' | translate }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                formControlName="hiredAt"
              />
              <p
                *ngIf="createForm.controls.hiredAt.touched && createForm.controls.hiredAt.invalid"
                class="text-xs text-red-600"
              >
                {{ 'PAGES.EMPLOYEE_RECORDS.LIST.VALIDATION.REQUIRED' | translate }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="closeCreateDrawer()"
            >
              {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.ACTION_CANCEL' | translate }}
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
              [disabled]="createSubmitting()"
            >
              <span
                *ngIf="createSubmitting()"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              ></span>
              {{ 'PAGES.EMPLOYEE_RECORDS.LIST.CREATE.ACTION_SUBMIT' | translate }}
            </button>
          </div>
        </form>
      </aside>
    </div>

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
  private readonly fb = inject(FormBuilder);
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
  protected readonly createDrawerOpen = signal(false);
  protected readonly createSubmitting = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly departmentOptions = [
    { value: 'People Operations', labelKey: 'COMMON.DEPARTMENTS.HR' },
    { value: 'Technology', labelKey: 'COMMON.DEPARTMENTS.IT' },
    { value: 'Finance', labelKey: 'COMMON.DEPARTMENTS.FINANCE' },
    { value: 'Marketing', labelKey: 'COMMON.DEPARTMENTS.MARKETING' },
    { value: 'Customer Success', labelKey: 'COMMON.DEPARTMENTS.CUSTOMER_SUCCESS' },
    { value: 'Operations', labelKey: 'COMMON.DEPARTMENTS.OPERATIONS' },
    { value: 'Sales', labelKey: 'COMMON.DEPARTMENTS.SALES' },
    { value: 'Data & Analytics', labelKey: 'COMMON.DEPARTMENTS.DATA_ANALYTICS' }
  ];
  protected readonly statusOptions = [
    { value: 'Active', labelKey: 'COMMON.STATUSES.ACTIVE' },
    { value: 'On Leave', labelKey: 'COMMON.STATUSES.ON_LEAVE' },
    { value: 'Probation', labelKey: 'COMMON.STATUSES.PROBATION' }
  ];

  protected readonly createForm: CreateEmployeeFormGroup = this.fb.nonNullable.group({
    employeeNumber: ['', [Validators.required, Validators.maxLength(32)]],
    fullName: ['', [Validators.required, Validators.maxLength(128)]],
    department: ['', [Validators.required, Validators.maxLength(128)]],
    position: ['', [Validators.required, Validators.maxLength(128)]],
    status: ['Active', [Validators.required, Validators.maxLength(64)]],
    hiredAt: [formatDateInput(new Date()), Validators.required]
  });

  protected readonly actions: PageAction[] = [
    {
      labelKey: 'PAGES.EMPLOYEE_RECORDS.LIST.ACTIONS.ADD',
      icon: 'person_add',
      variant: 'primary',
      actionKey: 'add-employee'
    }
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

  protected openCreateDrawer(): void {
    this.resetCreateForm();
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.createDrawerOpen.set(true);
  }

  protected closeCreateDrawer(): void {
    this.createDrawerOpen.set(false);
    this.createSubmitting.set(false);
    this.createError.set(null);
    this.resetCreateForm();
  }

  protected submitCreateForm(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.createSubmitting.set(true);
    this.createError.set(null);

    const payload = this.buildCreateRequest();

    this.actionsService
      .createEmployee(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employee) => this.handleCreateSuccess(employee),
        error: (error) => this.handleCreateError(error)
      });
  }

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.currentFilters.set(filters);
  }

  protected onActionTriggered(event: PageActionEvent): void {
    if (event.action.actionKey === 'add-employee') {
      this.openCreateDrawer();
    }
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

  private buildCreateRequest(): EmployeeCreateRequest {
    const value = this.createForm.getRawValue();
    return {
      employeeNumber: value.employeeNumber,
      fullName: value.fullName,
      department: value.department,
      position: value.position,
      status: value.status,
      hiredAt: value.hiredAt
    };
  }

  private handleCreateSuccess(employee: Employee): void {
    this.createSubmitting.set(false);
    this.closeCreateDrawer();
    this.successMessage.set('PAGES.EMPLOYEE_RECORDS.LIST.MESSAGES.CREATED');
    this.errorMessage.set(null);
    this.layout?.refresh();
    this.openProfileDrawer(employee.employeeNumber, employee.fullName);
  }

  private handleCreateError(error: unknown): void {
    this.createSubmitting.set(false);

    const code = this.resolveErrorCode(error);
    if (code === 'EMPLOYEE_NUMBER_EXISTS') {
      this.createForm.controls.employeeNumber.setErrors({ conflict: true });
      this.createError.set('PAGES.EMPLOYEE_RECORDS.LIST.ERRORS.EMPLOYEE_NUMBER_EXISTS');
      return;
    }

    this.createError.set('PAGES.EMPLOYEE_RECORDS.LIST.ERRORS.GENERIC');
  }

  private resolveErrorCode(error: unknown): string | null {
    if (!error || typeof error !== 'object') {
      return null;
    }

    const candidate = error as { error?: { message?: unknown }; message?: unknown };
    const message = candidate?.error?.message ?? candidate?.message;
    return typeof message === 'string' ? message : null;
  }

  private resetCreateForm(): void {
    this.createForm.reset(
      {
        employeeNumber: '',
        fullName: '',
        department: '',
        position: '',
        status: 'Active',
        hiredAt: formatDateInput(new Date())
      },
      { emitEvent: false }
    );
    this.createForm.markAsPristine();
    this.createForm.markAsUntouched();
  }
}
