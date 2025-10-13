import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import { EmployeeProfile, EmployeeSummary } from '../models/employee-profile.model';
import { EmployeeProfileViewComponent } from '../components/employee-profile-view.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, EmployeeProfileViewComponent],
  template: `
    <section class="grid gap-6 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr]">
      <aside class="card card-padding flex h-full flex-col gap-4">
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

        <div class="space-y-2">
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
        </div>

        <div class="-mx-4 flex-1 overflow-hidden">
          <div class="max-h-[70vh] overflow-y-auto px-4">
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
                <ul class="space-y-1">
                  <li *ngFor="let employee of filteredEmployees(); trackBy: trackByEmployee" class="group">
                    <button
                      type="button"
                      class="w-full rounded-md border px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div class="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
            <ng-container *ngIf="employees().length > 0; else directoryNoEmployees">
              {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DIRECTORY.NO_RESULTS' | translate:{ query: searchQuery() } }}
            </ng-container>
          </div>
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
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);

  protected readonly employees = signal<EmployeeSummary[]>([]);
  protected readonly employeesLoading = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly filteredEmployees = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.employees();

    if (!query) {
      return list;
    }

    return list.filter((employee) => {
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

  ngOnInit(): void {
    this.fetchEmployees();
  }

  protected trackByEmployee(_: number, employee: EmployeeSummary): string {
    return employee.employeeNumber;
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
}
