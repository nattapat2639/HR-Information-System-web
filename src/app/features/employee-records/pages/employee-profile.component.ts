import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import {
  EmployeeFieldValueSet,
  EmployeeFieldValueUpdateCommand,
  EmployeeFieldValueUpdateItem,
  EmployeeFieldWithValue
} from '../models/employee-field-definition.model';
import { EmployeeProfile, EmployeeSummary } from '../models/employee-profile.model';
import { EmployeeProfileViewComponent } from '../components/employee-profile-view.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, EmployeeProfileViewComponent],
  providers: [DatePipe],
  template: `
    <section class="grid gap-6 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr]">
      <aside class="card card-padding flex h-full flex-col gap-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.TITLE' | translate }}
            </p>
            <p class="text-sm text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.SUBTITLE' | translate }}
            </p>
          </div>
          <span class="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600">
            {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.COUNT' | translate:{ count: employees().length } }}
          </span>
        </div>

        <div class="space-y-3">
          <label class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.SEARCH_LABEL' | translate }}
          </label>
          <div class="relative">
            <span class="material-icons pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              class="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              [value]="searchQuery()"
              (input)="onSearchInput($any($event.target)?.value ?? '')"
              (keydown)="onSearchKeydown($event)"
              [placeholder]="'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.SEARCH_PLACEHOLDER' | translate"
              [attr.aria-label]="'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.SEARCH_LABEL' | translate"
            />
            <button
              *ngIf="searchQuery()"
              type="button"
              class="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="clearSearch()"
            >
              <span class="material-icons text-[16px]">close</span>
              <span class="sr-only">{{ 'COMMON.ACTIONS.CLEAR' | translate }}</span>
            </button>
          </div>
          <label class="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            <span>{{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.DEPARTMENT_FILTER_LABEL' | translate }}</span>
            <select
              class="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              [value]="selectedDepartment()"
              (change)="onDepartmentFilterChange($any($event.target)?.value ?? '')"
            >
              <option value="">{{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.DEPARTMENT_FILTER_ALL' | translate }}</option>
              <option
                *ngFor="let option of departmentOptions(); trackBy: trackByDepartmentOption"
                [value]="option.value"
              >
                {{ option.value }} ({{ option.count }})
              </option>
            </select>
          </label>
        </div>

        <div class="-mx-3 flex-1 overflow-hidden">
          <div class="max-h-[60vh] overflow-y-auto px-3">
            <div *ngIf="employeesLoading()" class="flex justify-center py-6">
              <span class="relative inline-flex items-center justify-center">
                <span class="h-6 w-6 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></span>
                <span class="sr-only">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.LOADING' | translate }}
                </span>
              </span>
            </div>
            <ng-container *ngIf="!employeesLoading()">
              <ng-container *ngIf="filteredEmployees().length > 0; else directoryEmpty">
                <ul class="space-y-1.5">
                  <li *ngFor="let employee of filteredEmployees(); trackBy: trackByEmployee" class="group">
                    <button
                      type="button"
                      class="w-full rounded-md border px-3 py-2 text-left text-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [ngClass]="{
                        'border-blue-500 bg-blue-50 text-blue-700': selectedEmployee() === employee.employeeNumber,
                        'border-gray-200 bg-white text-gray-700': selectedEmployee() !== employee.employeeNumber
                      }"
                      (click)="onSelectEmployee(employee)"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold">{{ employee.fullName }}</span>
                        <span class="text-xs text-gray-500 group-hover:text-blue-600">
                          {{ employee.employeeNumber }}
                        </span>
                      </div>
                      <div class="mt-1 text-xs text-gray-500 group-hover:text-blue-600">
                        {{ employee.department }} • {{ employee.position }}
                      </div>
                      <div
                        class="mt-1 text-[11px] font-medium uppercase tracking-wide"
                        [ngClass]="selectedEmployee() === employee.employeeNumber ? 'text-blue-600' : 'text-gray-400'"
                      >
                        {{ employee.status }}
                      </div>
                    </button>
                  </li>
                </ul>
              </ng-container>
            </ng-container>
          </div>
        </div>

        <ng-template #directoryEmpty>
          <ng-container *ngIf="employees().length > 0; else directoryNoEmployees">
            <div class="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-5 text-center text-xs text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.NO_RESULTS' | translate:{ query: searchQuery() } }}
            </div>
          </ng-container>
        </ng-template>
        <ng-template #directoryNoEmployees>
          <span>{{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.EMPTY' | translate }}</span>
        </ng-template>
      </aside>

      <div class="space-y-4">
        <div class="card card-padding">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-xl font-semibold text-gray-900">
                {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.SUMMARY.TITLE' | translate }}
              </h1>
              <p class="text-sm text-gray-500">
                {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.SUMMARY.SUBTITLE' | translate }}
              </p>
            </div>
            <ng-container *ngIf="selectedEmployeeSummary() as summary">
              <div class="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600">
                <div class="text-sm font-semibold text-gray-900">
                  {{ summary.fullName }}
                </div>
                <div>
                  {{ summary.employeeNumber }} • {{ summary.department }}
                </div>
                <div class="mt-1 text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                  {{ summary.status }}
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <app-employee-profile-view
          [profile]="profile()"
          [loading]="loadingProfile()"
          [errorMessage]="loadError()"
        ></app-employee-profile-view>

        <div class="card card-padding space-y-4">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.TITLE' | translate }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.SUBTITLE' | translate }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="openFieldsDrawer()"
              [disabled]="fieldsLoading() || !dynamicFieldSet()"
            >
              <span class="material-icons text-[18px]">tune</span>
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.ACTION_EDIT' | translate }}
            </button>
          </div>

          <div
            *ngIf="fieldsActionSuccessKey()"
            class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700"
          >
            {{ fieldsActionSuccessKey() | translate }}
          </div>

          <div
            *ngIf="fieldsActionErrorKey()"
            class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
          >
            {{ fieldsActionErrorKey() | translate:fieldsActionErrorParams() }}
          </div>

          <div *ngIf="fieldsLoading()" class="flex justify-center py-6">
            <span class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></span>
          </div>

          <ng-container *ngIf="!fieldsLoading()">
            <div
              *ngIf="fieldsLoadError()"
              class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
            >
              {{ fieldsLoadError() | translate }}
            </div>
            <ng-container *ngIf="!fieldsLoadError()">
              <ng-container *ngIf="dynamicFieldGroups().length > 0; else noDynamicFields">
                <div class="space-y-4">
                  <div
                    *ngFor="let group of dynamicFieldGroups(); trackBy: trackByFieldGroup"
                    class="rounded-md border border-gray-200 px-4 py-3"
                  >
                    <h3 class="text-sm font-semibold text-gray-900">{{ group.category }}</h3>
                    <dl class="mt-3 divide-y divide-gray-100">
                      <div
                        *ngFor="let item of group.fields; trackBy: trackByDynamicField"
                        class="py-3 first:pt-0 last:pb-0"
                      >
                        <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {{ item.displayName }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ formatFieldValue(item) }}
                        </dd>
                        <div *ngIf="item.updatedAtUtc" class="mt-1 text-[11px] text-gray-500">
                          {{
                            'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.LAST_UPDATED'
                              | translate:{
                                date: (item.updatedAtUtc | date:'d MMM yyyy HH:mm'),
                                user: item.updatedBy || '-'
                              }
                          }}
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>
              </ng-container>
            </ng-container>
          </ng-container>

          <ng-template #noDynamicFields>
            <div class="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.EMPTY' | translate }}
            </div>
          </ng-template>
        </div>
      </div>
    </section>

    <div
      *ngIf="fieldsDrawerOpen()"
      class="fixed inset-0 z-30 flex"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.ACTION_EDIT' | translate"
    >
      <div class="absolute inset-0 bg-gray-900/60" (click)="closeFieldsDrawer()" aria-hidden="true"></div>
      <aside class="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.EDITING' | translate }}
            </p>
            <h2 class="text-lg font-semibold text-gray-900">
              {{
                selectedEmployeeSummary()?.fullName
                  ?? ('PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.TITLE' | translate)
              }}
            </h2>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="closeFieldsDrawer()"
          >
            <span class="material-icons text-[20px]">close</span>
          </button>
        </header>

        <form
          class="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          [formGroup]="fieldsForm"
          (ngSubmit)="submitFields()"
        >
          <ng-container *ngFor="let group of dynamicFieldGroups(); trackBy: trackByFieldGroup">
            <div class="space-y-3 rounded-md border border-gray-200 p-4">
              <h3 class="text-sm font-semibold text-gray-900">{{ group.category }}</h3>
              <ng-container *ngFor="let item of group.fields; trackBy: trackByDynamicField">
                <div class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {{ item.displayName }}
                    <span *ngIf="item.isRequired" class="text-red-500">*</span>
                  </label>
                  <ng-container [ngSwitch]="item.dataType.toLowerCase()">
                    <select
                      *ngSwitchCase="'select'"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [formControlName]="controlNameFor(item)"
                    >
                      <option value="">{{ 'COMMON.SELECT.PLACEHOLDER' | translate }}</option>
                      <option *ngFor="let option of item.options" [value]="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <select
                      *ngSwitchCase="'multi_select'"
                      multiple
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      size="5"
                      [formControlName]="controlNameFor(item)"
                    >
                      <option *ngFor="let option of item.options" [value]="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <input
                      *ngSwitchCase="'date'"
                      type="date"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [formControlName]="controlNameFor(item)"
                    />
                    <input
                      *ngSwitchCase="'email'"
                      type="email"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [formControlName]="controlNameFor(item)"
                    />
                    <input
                      *ngSwitchCase="'number'"
                      type="number"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [formControlName]="controlNameFor(item)"
                    />
                    <input
                      *ngSwitchDefault
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [formControlName]="controlNameFor(item)"
                    />
                  </ng-container>
                </div>
              </ng-container>
            </div>
          </ng-container>

          <div class="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="closeFieldsDrawer()"
            >
              {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.CANCEL' | translate }}
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
              [disabled]="fieldsSubmitting()"
            >
              <span
                *ngIf="fieldsSubmitting()"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              ></span>
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.ACTION_SAVE' | translate }}
            </button>
          </div>
        </form>
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);
  private readonly fb = inject(FormBuilder);
  private readonly datePipe = inject(DatePipe);

  protected readonly employees = signal<EmployeeSummary[]>([]);
  protected readonly employeesLoading = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly selectedDepartment = signal('');
  protected readonly departmentOptions = computed(() => {
    const counts = new Map<string, number>();
    for (const employee of this.employees()) {
      const department = employee.department?.trim();
      if (!department) {
        continue;
      }
      counts.set(department, (counts.get(department) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  });
  protected readonly filteredEmployees = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const departmentFilter = this.selectedDepartment();
    const list = this.employees();

    return list.filter((employee) => {
      if (departmentFilter && employee.department !== departmentFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const combined = `${employee.fullName} ${employee.employeeNumber} ${employee.department ?? ''} ${employee.position ?? ''} ${employee.status ?? ''}`.toLowerCase();
      return combined.includes(query);
    });
  });
  protected readonly selectedEmployee = signal<string | null>(null);
  protected readonly selectedEmployeeSummary = computed(() => {
    const current = this.selectedEmployee();
    if (!current) {
      return null;
    }

    return this.employees().find((employee) => employee.employeeNumber === current) ?? null;
  });
  protected readonly profile = signal<EmployeeProfile | null>(null);
  protected readonly loadingProfile = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly dynamicFieldSet = signal<EmployeeFieldValueSet | null>(null);
  protected readonly fieldsLoading = signal(false);
  protected readonly fieldsLoadError = signal<string | null>(null);
  protected readonly fieldsActionErrorKey = signal<string | null>(null);
  protected readonly fieldsActionErrorParams = signal<Record<string, unknown>>({});
  protected readonly fieldsActionSuccessKey = signal<string | null>(null);
  protected readonly fieldsDrawerOpen = signal(false);
  protected readonly fieldsSubmitting = signal(false);
  protected readonly dynamicFieldGroups = computed(() => {
    const set = this.dynamicFieldSet();
    if (!set) {
      return [] as Array<{ category: string; fields: EmployeeFieldWithValue[] }>;
    }

    const ordered = this.sortFields(set.fields);
    const groups = new Map<string, EmployeeFieldWithValue[]>();

    for (const field of ordered) {
      const category = field.category?.trim() || 'General';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(field);
    }

    return Array.from(groups.entries()).map(([category, fields]) => ({ category, fields }));
  });
  protected fieldsForm: FormGroup<Record<string, FormControl<unknown>>> = this.fb.group({});

  private orderedFields: EmployeeFieldWithValue[] = [];
  private readonly fieldControlLookup = new Map<string, { controlName: string; index: number }>();
  private readonly updatedBy = 'Employee Records UI';

  ngOnInit(): void {
    this.fetchEmployees();
  }

  protected trackByEmployee(_: number, employee: EmployeeSummary): string {
    return employee.employeeNumber;
  }

  protected trackByDepartmentOption(_: number, option: { value: string }): string {
    return option.value;
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    const candidates = this.filteredEmployees();
    if (candidates.length === 0) {
      return;
    }

    event.preventDefault();
    const [first] = candidates;
    if (first) {
      this.setActiveEmployee(first);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected onDepartmentFilterChange(value: string): void {
    this.selectedDepartment.set(value ?? '');
  }

  protected onSelectEmployee(employee: EmployeeSummary): void {
    this.setActiveEmployee(employee);
  }

  private fetchEmployees(): void {
    this.employeesLoading.set(true);

    this.actionsService
      .getEmployees(1, 40)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const list = response.items ?? [];
          this.employees.set(list);
          this.employeesLoading.set(false);

          if (list.length === 0) {
            this.selectedEmployee.set(null);
            this.searchQuery.set('');
            this.profile.set(null);
            this.loadError.set('PAGES.EMPLOYEE_RECORDS.PROFILE.EMPTY');
            this.loadingProfile.set(false);
            this.dynamicFieldSet.set(null);
            this.fieldsLoadError.set('PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.EMPTY');
            this.rebuildFieldsForm(null);
            return;
          }

          const currentSelected = this.selectedEmployee();
          const existing = currentSelected ? list.find((employee) => employee.employeeNumber === currentSelected) : null;
          const target = existing ?? list[0];
          this.setActiveEmployee(target);
        },
        error: () => {
          this.employees.set([]);
          this.employeesLoading.set(false);
          this.selectedEmployee.set(null);
          this.searchQuery.set('');
          this.profile.set(null);
          this.loadError.set('COMMON.ERROR.LOAD_FAILED');
          this.dynamicFieldSet.set(null);
          this.fieldsLoadError.set('COMMON.ERROR.LOAD_FAILED');
          this.rebuildFieldsForm(null);
        }
      });
  }

  private setActiveEmployee(employee: EmployeeSummary): void {
    if (!employee) {
      return;
    }

    const current = this.selectedEmployee();
    if (current === employee.employeeNumber) {
      if (!this.profile()) {
        this.loadProfile(employee.employeeNumber);
      }
      return;
    }

    this.selectedEmployee.set(employee.employeeNumber);
    this.loadProfile(employee.employeeNumber);
    this.loadFieldValues(employee.employeeNumber);
    this.fieldsActionSuccessKey.set(null);
    this.fieldsActionErrorKey.set(null);
    this.fieldsActionErrorParams.set({});
    this.fieldsDrawerOpen.set(false);
  }

  private loadProfile(employeeNumber: string): void {
    this.loadingProfile.set(true);
    this.loadError.set(null);

    this.actionsService
      .getProfile(employeeNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.profile.set(response);
          this.loadingProfile.set(false);
        },
        error: () => {
          this.profile.set(null);
          this.loadingProfile.set(false);
          this.loadError.set('COMMON.ERROR.LOAD_FAILED');
        }
      });
  }

  private loadFieldValues(employeeNumber: string): void {
    this.fieldsLoading.set(true);
    this.fieldsLoadError.set(null);
    this.dynamicFieldSet.set(null);
    this.rebuildFieldsForm(null);

    this.actionsService
      .getEmployeeFieldValues(employeeNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.dynamicFieldSet.set(response);
          this.fieldsLoading.set(false);
          this.rebuildFieldsForm(response);
        },
        error: () => {
          this.fieldsLoading.set(false);
          this.fieldsLoadError.set('COMMON.ERROR.LOAD_FAILED');
          this.dynamicFieldSet.set(null);
          this.rebuildFieldsForm(null);
        }
      });
  }

  private rebuildFieldsForm(fieldSet: EmployeeFieldValueSet | null): void {
    this.fieldControlLookup.clear();

    if (!fieldSet) {
      this.fieldsForm = this.fb.group({});
      this.orderedFields = [];
      return;
    }

    const ordered = this.sortFields(fieldSet.fields);
    const controls: Record<string, FormControl<unknown>> = {};

    ordered.forEach((field, index) => {
      const controlName = this.generateControlName(field, index);
      this.fieldControlLookup.set(field.id, { controlName, index });

      if (this.isMultiSelect(field)) {
        controls[controlName] = new FormControl<string[]>(this.parseMultiValue(field.value), {
          nonNullable: true
        });
      } else {
        controls[controlName] = new FormControl<string>(field.value ?? '');
      }
    });

    this.fieldsForm = this.fb.group(controls);
    this.fieldsForm.markAsPristine();
    this.orderedFields = ordered;
  }

  protected controlNameFor(field: EmployeeFieldWithValue): string {
    return this.fieldControlLookup.get(field.id)?.controlName ?? this.generateControlName(field, 0);
  }

  protected openFieldsDrawer(): void {
    if (!this.dynamicFieldSet()) {
      return;
    }
    this.fieldsActionErrorKey.set(null);
    this.fieldsActionErrorParams.set({});
    this.fieldsDrawerOpen.set(true);
  }

  protected closeFieldsDrawer(): void {
    this.fieldsDrawerOpen.set(false);
  }

  protected submitFields(): void {
    const payload = this.buildUpdatePayload();
    if (!payload) {
      return;
    }

    const currentEmployee = this.dynamicFieldSet();
    if (!currentEmployee) {
      return;
    }

    this.fieldsSubmitting.set(true);
    this.fieldsActionErrorKey.set(null);
    this.fieldsActionErrorParams.set({});

    this.actionsService
      .updateEmployeeFieldValues(currentEmployee.employeeNumber, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.dynamicFieldSet.set(response);
          this.rebuildFieldsForm(response);
          this.fieldsSubmitting.set(false);
          this.fieldsDrawerOpen.set(false);
          this.fieldsActionSuccessKey.set('PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.MESSAGES.UPDATED');
        },
        error: (error) => {
          this.fieldsSubmitting.set(false);
          const message = error?.error?.message as string | undefined;
          if (message?.startsWith('FIELD_VALUE_REQUIRED::')) {
            const [, fieldKey] = message.split('::');
            const field =
              this.orderedFields.find((candidate) => candidate.fieldKey === fieldKey) ?? null;
            this.fieldsActionErrorKey.set('PAGES.EMPLOYEE_RECORDS.PROFILE.DYNAMIC.ERRORS.REQUIRED');
            this.fieldsActionErrorParams.set({ field: field?.displayName ?? fieldKey ?? '' });
          } else {
            this.fieldsActionErrorKey.set('COMMON.ERROR.ACTION_FAILED');
            this.fieldsActionErrorParams.set({});
          }
        }
      });
  }

  protected formatFieldValue(field: EmployeeFieldWithValue): string {
    if (!field.value) {
      return '-';
    }

    const type = field.dataType?.toLowerCase() ?? 'text';
    if (type === 'select') {
      const option = field.options.find((candidate) => candidate.value === field.value);
      return option?.label ?? field.value;
    }

    if (type === 'multi_select') {
      const values = this.parseMultiValue(field.value);
      if (values.length === 0) {
        return '-';
      }
      return values
        .map((value) => field.options.find((candidate) => candidate.value === value)?.label ?? value)
        .join(', ');
    }

    if (type === 'date') {
      const parsed = new Date(field.value);
      if (!Number.isNaN(parsed.getTime())) {
        return this.datePipe.transform(parsed, 'd MMM yyyy') ?? field.value;
      }
    }

    return field.value;
  }

  protected trackByFieldGroup(_: number, group: { category: string }): string {
    return group.category;
  }

  protected trackByDynamicField(_: number, field: EmployeeFieldWithValue): string {
    return field.id;
  }

  private buildUpdatePayload(): EmployeeFieldValueUpdateCommand | null {
    const set = this.dynamicFieldSet();
    if (!set) {
      return null;
    }

    const updates: EmployeeFieldValueUpdateItem[] = [];

    for (const field of this.orderedFields) {
      const lookup = this.fieldControlLookup.get(field.id);
      if (!lookup) {
        continue;
      }

      const control = this.fieldsForm.get(lookup.controlName);
      if (!control) {
        continue;
      }

      const type = field.dataType?.toLowerCase() ?? 'text';
      if (type === 'multi_select') {
        const values = (control.value as string[] | null) ?? [];
        updates.push({ fieldKey: field.fieldKey, values });
        continue;
      }

      const raw = control.value;
      const value = raw == null ? '' : String(raw);
      updates.push({ fieldKey: field.fieldKey, value });
    }

    return {
      updatedBy: this.updatedBy,
      fields: updates
    };
  }

  private sortFields(fields: EmployeeFieldWithValue[]): EmployeeFieldWithValue[] {
    return [...fields].sort((a, b) => {
      if (a.sortOrder === b.sortOrder) {
        return a.displayName.localeCompare(b.displayName);
      }
      return a.sortOrder - b.sortOrder;
    });
  }

  private generateControlName(field: EmployeeFieldWithValue, index: number): string {
    const safeId = field.id.replace(/[^a-zA-Z0-9]/g, '_');
    return `field_${index}_${safeId}`;
  }

  private parseMultiValue(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }
    return value
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private isMultiSelect(field: EmployeeFieldWithValue): boolean {
    return field.dataType.toLowerCase() === 'multi_select';
  }
}
