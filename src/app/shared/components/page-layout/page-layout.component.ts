import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PageDataService, PageDataResponse, PageRow } from '../../../core/services/page-data.service';

export interface PageAction {
  labelKey: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  todoKey?: string;
  actionKey?: string;
  disabled?: boolean;
}

export interface FilterField {
  labelKey: string;
  placeholderKey?: string;
  type: 'text' | 'select' | 'date';
  optionKeys?: string[];
  options?: Array<{ labelKey?: string; value: string }>;
  queryKey?: string;
}

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './page-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLayoutComponent {
  private static readonly PAGE_SIZE_OPTIONS = [10, 20, 50];

  @Input({ required: true }) pageTitleKey!: string;
  @Input() pageSubtitleKey?: string;
  @Input() contentTitleKey!: string;
  @Input() contentSubtitleKey?: string;
  @Input() todoKey: string = 'COMMON.TABLE.NO_DATA';
  @Input() actions: PageAction[] = [];
  private _filterFields: FilterField[] = [];
  @Input() set filterFields(value: FilterField[]) {
    this._filterFields = value ?? [];
    this.rebuildForm();
  }
  get filterFields(): FilterField[] {
    return this._filterFields;
  }
  @Input() tableHeaderKeys: string[] = [];
  @Input() showExportButton = false;
  @Input() exportLabelKey = 'COMMON.ACTIONS.EXPORT';
  @Input() showResetFilterButton = true;
  @Input() set moduleKey(value: string) {
    if (value === this._moduleKey) {
      return;
    }
    this._moduleKey = value;
    this.loadPageData();
  }
  @Input() set pageKey(value: string) {
    if (value === this._pageKey) {
      return;
    }
    this._pageKey = value;
    this.loadPageData();
  }
  @Input() autoLoad = true;

  private readonly pageDataService = inject(PageDataService);
  private readonly destroyRef = inject(DestroyRef);

  private _moduleKey = '';
  private _pageKey = '';
  private hasLoaded = false;
  private readonly filterKeyMap = new Map<string, string>();
  private controlNames: string[] = [];

  readonly form = new FormGroup({});
  readonly pageNumber = signal(1);
  readonly pageSize = signal(20);
  readonly totalCount = signal(0);
  readonly pageSizeOptions = signal(PageLayoutComponent.PAGE_SIZE_OPTIONS);

  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);
  readonly backendNoteKey = signal<string | null>(null);
  readonly tableRows = signal<PageRow[]>([]);
  private readonly dynamicHeaders = signal<string[]>([]);
  @Output() readonly actionTriggered = new EventEmitter<PageActionEvent>();
  @Output() readonly filtersChanged = new EventEmitter<Record<string, string>>();
  @Output() readonly exportRequested = new EventEmitter<Record<string, string>>();

  readonly headerKeys = computed(() =>
    this.tableHeaderKeys.length > 0 ? this.tableHeaderKeys : this.dynamicHeaders()
  );
  readonly hasTableData = computed(
    () => this.tableRows().length > 0 && this.headerKeys().length > 0
  );
  readonly hasRowActions = computed(
    () => this.tableRows().some((row) => (row.actions?.length ?? 0) > 0)
  );
  readonly emptyMessageKey = computed(
    () => this.backendNoteKey() ?? this.todoKey ?? 'COMMON.TABLE.NO_DATA'
  );
  readonly totalPages = computed(() => {
    const size = Math.max(this.pageSize(), 1);
    const total = this.totalCount();
    if (total === 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(total / size));
  });
  readonly startIndex = computed(() => {
    const total = this.totalCount();
    if (total === 0) {
      return 0;
    }
    return Math.min((this.pageNumber() - 1) * this.pageSize() + 1, total);
  });
  readonly endIndex = computed(() => {
    const total = this.totalCount();
    if (total === 0) {
      return 0;
    }
    return Math.min(this.pageNumber() * this.pageSize(), total);
  });

  getActionClasses(action: PageAction): string {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500';
    if (action.disabled) {
      return `${base} bg-gray-200 text-gray-400 cursor-not-allowed`;
    }
    switch (action.variant) {
      case 'primary':
        return `${base} bg-blue-600 text-white hover:bg-blue-700`;
      case 'secondary':
        return `${base} border border-gray-300 text-gray-700 bg-white hover:bg-gray-100`;
      default:
        return `${base} text-gray-600 hover:text-blue-600`;
    }
  }

  trackByKey(_: number, item: { labelKey: string } | string): string {
    return typeof item === 'string' ? item : item.labelKey;
  }

  optionTrack(_: number, item: { value: string }): string {
    return item.value;
  }

  trackRow(_: number, row: PageRow): PageRow {
    return row;
  }

  trackColumn(_: number, header: string): string {
    return header;
  }

  getCellValue(row: PageRow, header: string): string {
    return row.columns[header] ?? '-';
  }

  refresh(): void {
    this.form.reset();
    this.pageNumber.set(1);
    this.hasLoaded = false;
    this.emitCurrentFilters();
    this.loadPageData(true);
  }

  controlNameAt(index: number): string {
    return this.controlNames[index] ?? '';
  }

  onSubmit(): void {
    this.pageNumber.set(1);
    this.loadPageData(true);
    this.emitCurrentFilters();
  }

  goToPreviousPage(): void {
    if (this.pageNumber() <= 1) {
      return;
    }
    this.pageNumber.update((current) => Math.max(1, current - 1));
    this.loadPageData(true);
  }

  goToNextPage(): void {
    if (this.pageNumber() >= this.totalPages()) {
      return;
    }
    this.pageNumber.update((current) => current + 1);
    this.loadPageData(true);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ?? '';
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return;
    }
    if (parsed === this.pageSize()) {
      return;
    }
    this.pageSize.set(parsed);
    this.pageNumber.set(1);
    this.loadPageData(true);
  }

  private loadPageData(force = false): void {
    if (!this.autoLoad) {
      return;
    }

    if (this._moduleKey === '' || this._pageKey === '') {
      return;
    }

    if (this.hasLoaded && !force) {
      return;
    }

    this.loading.set(true);
    this.errorKey.set(null);

    const query: Record<string, string> = {
      pageNumber: this.pageNumber().toString(),
      pageSize: this.pageSize().toString()
    };

    const filterQuery = this.collectFilterQuery();
    for (const [key, value] of Object.entries(filterQuery)) {
      query[key] = value;
    }

    this.pageDataService
      .getPageData(this._moduleKey, this._pageKey, query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.handleSuccess(response),
        error: () => {
          this.errorKey.set('COMMON.ERROR.LOAD_FAILED');
          this.tableRows.set([]);
          this.loading.set(false);
        }
      });
  }

  private handleSuccess(response: PageDataResponse): void {
    this.tableRows.set(response.rows ?? []);
    this.backendNoteKey.set(response.noteKey ?? null);
    this.pageNumber.set(response.pageNumber ?? 1);
    this.pageSize.set(response.pageSize ?? this.pageSize());
    const currentSize = this.pageSize();
    if (!this.pageSizeOptions().includes(currentSize)) {
      const nextOptions = [...this.pageSizeOptions(), currentSize].sort((a, b) => a - b);
      this.pageSizeOptions.set(nextOptions);
    }
    this.totalCount.set(response.totalCount ?? response.rows?.length ?? 0);
    const firstRow = response.rows?.[0];
    if (firstRow) {
      this.dynamicHeaders.set(Object.keys(firstRow.columns));
    } else {
      this.dynamicHeaders.set([]);
    }
    const totalPages = this.totalPages();
    if (this.totalCount() > 0 && this.pageNumber() > totalPages) {
      this.pageNumber.set(totalPages);
      this.loadPageData(true);
      return;
    }
    this.loading.set(false);
    this.errorKey.set(null);
    this.hasLoaded = true;
  }

  private rebuildForm(): void {
    const controls = this.form.controls as Record<string, FormControl>;
    for (const key of Object.keys(controls)) {
      this.form.removeControl(key);
    }

    this.filterKeyMap.clear();
    this.controlNames = [];

    this._filterFields.forEach((field, index) => {
      const queryKey = field.queryKey ?? field.labelKey;
      const controlName = this.buildControlName(queryKey, index);
      this.filterKeyMap.set(controlName, queryKey);
      this.form.addControl(controlName, new FormControl(''));
      this.controlNames.push(controlName);
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.hasLoaded = false;

    if (this._moduleKey && this._pageKey) {
      this.loadPageData(true);
    }
  }

  private buildControlName(queryKey: string, index: number): string {
    const base = this.normaliseKey(queryKey);
    if (!base) {
      return `filter_${index}`;
    }

    return `${base}_${index}`;
  }

  private normaliseKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private collectFilterQuery(): Record<string, string> {
    const result: Record<string, string> = {};
    const controls = this.form.controls as Record<string, FormControl>;

    for (const key of Object.keys(controls)) {
      const control = controls[key];
      const raw = control?.value;
      if (raw === null || raw === undefined) {
        continue;
      }

      const value = String(raw).trim();
      if (!value) {
        continue;
      }

      const queryKey = this.filterKeyMap.get(key) ?? key;
      result[queryKey] = value;
    }

    return result;
  }

  onAction(action: PageAction): void {
    if (action.disabled) {
      return;
    }

    this.actionTriggered.emit({
      action,
      filters: this.collectFilterQuery()
    });
  }

  onExport(): void {
    this.exportRequested.emit(this.collectFilterQuery());
  }

  isBadgeColumn(header: string): boolean {
    return /STATUS|STATE|EVENT/i.test(header);
  }

  getBadgeClass(header: string, value: string): string {
    const normalized = value.toLowerCase();
    if (/status/i.test(header)) {
      if (normalized.includes('active') || normalized.includes('completed')) {
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      }
      if (normalized.includes('leave') || normalized.includes('pending') || normalized.includes('probation')) {
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      }
      if (normalized.includes('inactive') || normalized.includes('terminated') || normalized.includes('rejected')) {
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      }
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    }

    if (/event/i.test(header)) {
      if (normalized.includes('promotion')) {
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      }
      if (normalized.includes('transfer')) {
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      }
      if (normalized.includes('award') || normalized.includes('recognition')) {
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      }
      if (normalized.includes('probation')) {
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      }
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    }

    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  private emitCurrentFilters(): void {
    this.filtersChanged.emit(this.collectFilterQuery());
  }
}

export interface PageActionEvent {
  action: PageAction;
  filters: Record<string, string>;
}
