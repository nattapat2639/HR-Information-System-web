import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { FilterField, PageLayoutComponent, PageRowActionEvent } from '../../../shared/components/page-layout/page-layout.component';
import { LeaveManagementService, LeaveRequestDetail } from '../leave-management.service';
import { LeaveRequestDetailPanelComponent } from '../components/leave-request-detail-panel.component';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, LeaveRequestDetailPanelComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        moduleKey="leave-management"
        pageKey="history"
        pageTitleKey="PAGES.LEAVE.HISTORY.TITLE"
        pageSubtitleKey="PAGES.LEAVE.HISTORY.SUBTITLE"
        contentTitleKey="PAGES.LEAVE.HISTORY.CONTENT_TITLE"
        contentSubtitleKey="PAGES.LEAVE.HISTORY.CONTENT_SUBTITLE"
        todoKey="PAGES.LEAVE.HISTORY.TODO"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="true"
        (rowActionTriggered)="onRowAction($event)"
        (exportRequested)="onExport($event)"
      ></app-page-layout>

      <app-leave-request-detail-panel
        *ngIf="selectedRequest() as detail"
        [request]="detail"
        (close)="selectedRequest.set(null)"
      ></app-leave-request-detail-panel>

      <div
        *ngIf="successMessage()"
        class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"
      >
        {{ successMessage() | translate }}
      </div>

      <div
        *ngIf="errorMessage()"
        class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
      >
        {{ errorMessage() | translate }}
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveHistoryComponent {
  private readonly leaveService = inject(LeaveManagementService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(PageLayoutComponent) private pageLayout?: PageLayoutComponent;

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedRequest = signal<LeaveRequestDetail | null>(null);

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.YEAR',
      type: 'select',
      queryKey: 'year',
      options: [
        { labelKey: 'COMMON.YEARS.CURRENT', value: '2025' },
        { labelKey: 'COMMON.YEARS.LAST', value: '2024' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.APPROVED', value: 'Approved' },
        { labelKey: 'COMMON.STATUSES.REJECTED', value: 'Rejected' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.HISTORY.COLUMNS.REFERENCE',
    'PAGES.LEAVE.HISTORY.COLUMNS.TYPE',
    'PAGES.LEAVE.HISTORY.COLUMNS.PERIOD',
    'PAGES.LEAVE.HISTORY.COLUMNS.DAY_USED',
    'PAGES.LEAVE.HISTORY.COLUMNS.STATUS'
  ];

  protected onRowAction(event: PageRowActionEvent): void {
    const id = event.row.columns['META.REQUEST_ID'];
    if (!id) {
      return;
    }
    this.leaveService
      .getRequest(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => this.selectedRequest.set(detail),
        error: (error) => this.handleError(error)
      });
  }

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.leaveService
      .exportHistory(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `leave-history-${Date.now()}.csv`;
          anchor.click();
          URL.revokeObjectURL(url);
          this.successMessage.set('PAGES.LEAVE.MESSAGES.HISTORY_EXPORTED');
        },
        error: (error) => this.handleError(error)
      });
  }

  private handleError(error: unknown): void {
    const fallback = 'COMMON.ERROR.ACTION_FAILED';
    if (error && typeof error === 'object' && 'error' in error) {
      const payload = (error as { error?: { message?: string } }).error;
      this.errorMessage.set(payload?.message ?? fallback);
    } else {
      this.errorMessage.set(fallback);
    }
  }
}
