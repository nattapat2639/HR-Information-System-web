import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FilterField, PageAction, PageLayoutComponent, PageRowActionEvent, PageSelectionChangeEvent } from '../../../shared/components/page-layout/page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import { EmployeeProfile, EmployeeSearchInsights } from '../models/employee-profile.model';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexPlotOptions, ApexDataLabels, ApexTooltip, ApexXAxis, ApexStroke, ApexFill } from 'ng-apexcharts';
import { EmployeeProfileViewComponent } from '../components/employee-profile-view.component';

type MiniChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  xaxis?: ApexXAxis;
  colors?: string[];
  stroke?: ApexStroke;
  fill?: ApexFill;
};

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, NgApexchartsModule, EmployeeProfileViewComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        #layout
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
          {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.SELECTION.COUNT' | translate:{ count: selectedEmployeeIds().length } }}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="exportSelected()"
          >
            <span class="material-icons text-[16px]">file_download</span>
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.SELECTION.EXPORT' | translate }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="clearSelection()"
          >
            <span class="material-icons text-[16px]">clear</span>
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.SELECTION.CLEAR' | translate }}
          </button>
        </div>
      </div>
      <ng-template #insightsLoading>
        <div class="card card-padding flex justify-center py-6">
          <span class="h-6 w-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
        </div>
      </ng-template>
      <ng-template #statusEmpty>
        <div class="mt-4 text-xs text-gray-500">
          {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.NO_DATA' | translate }}
        </div>
      </ng-template>
      <ng-template #departmentEmpty>
        <div class="mt-4 text-xs text-gray-500">
          {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.NO_DATA' | translate }}
        </div>
      </ng-template>
      <div *ngIf="insights() as stats; else insightsLoading" class="grid gap-4 md:grid-cols-2">
        <div class="card card-padding">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.STATUS_HEADER' | translate }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.SUBTITLE' | translate }}
          </p>
          <ng-container *ngIf="statusChartOptions() as statusOptions; else statusEmpty">
            <apx-chart
              [series]="statusOptions.series"
              [chart]="statusOptions.chart"
              [plotOptions]="statusOptions.plotOptions!"
              [dataLabels]="statusOptions.dataLabels!"
              [tooltip]="statusOptions.tooltip!"
              [xaxis]="statusOptions.xaxis!"
              [colors]="statusOptions.colors || []"
            ></apx-chart>
            <ul class="mt-2 text-xs text-gray-500">
              <li *ngFor="let item of stats.status; trackBy: trackByLabel">
                {{ item.label }} — {{ getPercentage(item.count, statusMax()) }}% ({{ item.count | number }})
              </li>
            </ul>
          </ng-container>
        </div>
        <div class="card card-padding">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.DEPARTMENT_HEADER' | translate }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ 'PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.SUBTITLE' | translate }}
          </p>
          <ng-container *ngIf="departmentChartOptions() as departmentOptions; else departmentEmpty">
            <apx-chart
              [series]="departmentOptions.series"
              [chart]="departmentOptions.chart"
              [stroke]="departmentOptions.stroke!"
              [fill]="departmentOptions.fill!"
              [tooltip]="departmentOptions.tooltip!"
              [colors]="departmentOptions.colors || []"
              [dataLabels]="departmentOptions.dataLabels!"
              [xaxis]="departmentOptions.xaxis!"
            ></apx-chart>
            <ul class="mt-2 text-xs text-gray-500">
              <li *ngFor="let item of stats.topDepartments; trackBy: trackByLabel">
                {{ item.label }} — {{ getPercentage(item.count, departmentMax()) }}% ({{ item.count | number }})
              </li>
            </ul>
          </ng-container>
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
export class EmployeeSearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(EmployeeRecordsActionsService);
  @ViewChild('layout') private layout?: PageLayoutComponent;

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly insights = signal<EmployeeSearchInsights | null>(null);
  protected readonly currentFilters = signal<Record<string, string>>({});
  protected readonly loadingInsights = signal(false);
  protected readonly statusMax = signal(0);
  protected readonly departmentMax = signal(0);
  protected readonly statusChartOptions = signal<MiniChartOptions | null>(null);
  protected readonly departmentChartOptions = signal<MiniChartOptions | null>(null);
  protected readonly selectedEmployeeIds = signal<string[]>([]);
  protected readonly selectionKey = 'PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.EMPLOYEE_ID';
  protected readonly profileDrawerOpen = signal(false);
  protected readonly profileDrawerLoading = signal(false);
  protected readonly profileDrawerData = signal<EmployeeProfile | null>(null);
  protected readonly profileDrawerError = signal<string | null>(null);
  protected readonly profileDrawerName = signal<string>('');
  protected readonly profileDrawerEmployeeNumber = signal<string | null>(null);
  private readonly translate = inject(TranslateService);

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

  ngOnInit(): void {
    this.loadInsights({});
  }

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.currentFilters.set(filters);
    this.loadInsights(filters);
  }

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.currentFilters.set(filters);
    const selected = this.selectedEmployeeIds();

    this.actionsService
      .exportSearch(filters, selected.length > 0 ? selected : [])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('employee-search-results.csv', blob);
          this.successMessage.set('EMPLOYEE_RECORDS.EXPORT.SUCCESS');
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  protected getPercentage(count: number, max: number): number {
    if (max <= 0) {
      return 0;
    }
    return Math.round((count / max) * 100);
  }

  protected onSelectionChanged(event: PageSelectionChangeEvent): void {
    this.selectedEmployeeIds.set(event.keys);
  }

  protected exportSelected(): void {
    const selected = this.selectedEmployeeIds();
    if (selected.length === 0) {
      return;
    }

    this.actionsService
      .exportSearch(this.currentFilters(), selected)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('employee-search-selected.csv', blob);
          this.successMessage.set('EMPLOYEE_RECORDS.EXPORT.SUCCESS');
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  protected clearSelection(): void {
    this.layout?.clearSelection();
  }

  protected trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  protected onRowAction(event: PageRowActionEvent): void {
    if (event.action.actionKey !== 'view-profile') {
      return;
    }

    const employeeNumber =
      event.row.columns['PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.EMPLOYEE_ID'] ??
      event.row.columns['PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.EMPLOYEE_ID'];
    const name =
      event.row.columns['PAGES.EMPLOYEE_RECORDS.SEARCH.COLUMNS.NAME'] ??
      event.row.columns['PAGES.EMPLOYEE_RECORDS.LIST.COLUMNS.NAME'] ??
      '';

    if (!employeeNumber) {
      return;
    }

    this.openProfileDrawer(employeeNumber, name);
  }

  private triggerDownload(fileName: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private loadInsights(filters: Record<string, string>): void {
    this.loadingInsights.set(true);
    this.insights.set(null);

    this.actionsService
      .getSearchInsights(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.insights.set(response);
          this.updateCharts(response);
          this.loadingInsights.set(false);
        },
        error: () => {
          this.insights.set({ status: [], topDepartments: [] });
          this.statusMax.set(0);
          this.departmentMax.set(0);
          this.statusChartOptions.set(null);
          this.departmentChartOptions.set(null);
          this.loadingInsights.set(false);
        }
      });
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

  private updateCharts(insights: EmployeeSearchInsights): void {
    if (insights.status.length > 0) {
      const statusCounts = insights.status.map((item) => item.count);
      const statusLabels = insights.status.map((item) => item.label);
      const max = Math.max(...statusCounts);
      this.statusMax.set(max);

      this.statusChartOptions.set({
        series: [{
          name: this.translate.instant('PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.STATUS_HEADER'),
          data: statusCounts
        }],
        chart: {
          type: 'bar',
          height: 160,
          sparkline: { enabled: true }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '70%'
          }
        },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: (value: number, opts) => {
              const label = statusLabels[opts.dataPointIndex] ?? '';
              const percent = this.getPercentage(value, max);
              return `${label}: ${percent}% (${value})`;
            }
          }
        },
        xaxis: {
          categories: statusLabels,
          labels: { show: false }
        },
        colors: statusLabels.map((label) => this.resolveStatusColor(label))
      });
    } else {
      this.statusMax.set(0);
      this.statusChartOptions.set(null);
    }

    if (insights.topDepartments.length > 0) {
      const departmentCounts = insights.topDepartments.map((item) => item.count);
      const departmentLabels = insights.topDepartments.map((item) => item.label);
      const max = Math.max(...departmentCounts);
      this.departmentMax.set(max);

      this.departmentChartOptions.set({
        series: [{
          name: this.translate.instant('PAGES.EMPLOYEE_RECORDS.SEARCH.INSIGHTS.DEPARTMENT_HEADER'),
          data: departmentCounts
        }],
        chart: {
          type: 'area',
          height: 160,
          sparkline: { enabled: true }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        fill: {
          opacity: 0.25
        },
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: (value: number, opts) => {
              const label = departmentLabels[opts.dataPointIndex] ?? '';
              const percent = this.getPercentage(value, max);
              return `${label}: ${percent}% (${value})`;
            }
          }
        },
        colors: [this.resolveDepartmentColor(departmentLabels[0] ?? 'default')],
        xaxis: {
          categories: departmentLabels
        }
      });
    } else {
      this.departmentMax.set(0);
      this.departmentChartOptions.set(null);
    }
  }

  private resolveStatusColor(label: string): string {
    const normalized = label.toLowerCase();
    if (normalized.includes('active')) {
      return '#10b981';
    }
    if (normalized.includes('leave') || normalized.includes('pending')) {
      return '#f59e0b';
    }
    if (normalized.includes('probation')) {
      return '#3b82f6';
    }
    if (normalized.includes('inactive') || normalized.includes('terminated')) {
      return '#ef4444';
    }
    return '#64748b';
  }

  private resolveDepartmentColor(label: string): string {
    const normalized = label.toLowerCase();
    if (normalized.includes('technology') || normalized.includes('data')) {
      return '#6366f1';
    }
    if (normalized.includes('sales')) {
      return '#a855f7';
    }
    if (normalized.includes('marketing')) {
      return '#ec4899';
    }
    if (normalized.includes('customer')) {
      return '#10b981';
    }
    if (normalized.includes('operations')) {
      return '#14b8a6';
    }
    return '#3b82f6';
  }
}
