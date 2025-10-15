import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FilterField,
  PageAction,
  PageActionEvent,
  PageLayoutComponent,
  PageRowActionEvent
} from '../../../shared/components/page-layout/page-layout.component';
import { LeaveManagementService, LeaveRequestDetail } from '../leave-management.service';
import { LeaveRequestDetailPanelComponent } from '../components/leave-request-detail-panel.component';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, LeaveRequestDetailPanelComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        moduleKey="leave-management"
        pageKey="my"
        pageTitleKey="PAGES.LEAVE.MY.TITLE"
        pageSubtitleKey="PAGES.LEAVE.MY.SUBTITLE"
        contentTitleKey="PAGES.LEAVE.MY.CONTENT_TITLE"
        contentSubtitleKey="PAGES.LEAVE.MY.CONTENT_SUBTITLE"
        todoKey="PAGES.LEAVE.MY.TODO"
        [actions]="actions()"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="false"
        (actionTriggered)="onAction($event)"
        (rowActionTriggered)="onRowAction($event)"
        (filtersChanged)="onFiltersChanged($event)"
      ></app-page-layout>

      <app-leave-request-detail-panel
        *ngIf="selectedRequest() as detail"
        [request]="detail"
        (close)="clearSelectedDetail()"
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
export class LeaveListComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly leaveService = inject(LeaveManagementService);
  private readonly translateService = inject(TranslateService);

  @ViewChild(PageLayoutComponent) private pageLayout?: PageLayoutComponent;

  private readonly actionTemplate: PageAction[] = [
    { labelKey: 'PAGES.LEAVE.MY.ACTIONS.CREATE', icon: 'add_circle', variant: 'primary', actionKey: 'create-request' }
  ];

  protected readonly actions = computed(() => this.actionTemplate);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedRequest = signal<LeaveRequestDetail | null>(null);

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.UNPAID', value: 'Unpaid Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.FAMILY', value: 'Family Responsibility' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      options: [
        { labelKey: 'COMMON.STATUSES.PENDING', value: 'Pending' },
        { labelKey: 'COMMON.STATUSES.APPROVED', value: 'Approved' },
        { labelKey: 'COMMON.STATUSES.REJECTED', value: 'Rejected' },
        { labelKey: 'COMMON.STATUSES.WITHDRAWN', value: 'Withdrawn' }
      ]
    },
    {
      labelKey: 'COMMON.FIELDS.START_DATE',
      type: 'date',
      queryKey: 'startDate'
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.MY.COLUMNS.REFERENCE',
    'PAGES.LEAVE.MY.COLUMNS.TYPE',
    'PAGES.LEAVE.MY.COLUMNS.START',
    'PAGES.LEAVE.MY.COLUMNS.END',
    'PAGES.LEAVE.MY.COLUMNS.STATUS'
  ];

  protected onAction(event: PageActionEvent): void {
    this.clearMessages();
    if (event.action.actionKey === 'create-request') {
      this.router.navigate(['/leave-management', 'create']);
    }
  }

  protected onRowAction(event: PageRowActionEvent): void {
    const requestId = event.row.columns['META.REQUEST_ID'];
    if (!requestId) {
      return;
    }

    this.clearMessages();

    switch (event.action.actionKey) {
      case 'leave:withdraw':
        if (window.confirm(this.translateService.instant('PAGES.LEAVE.CONFIRM.WITHDRAW'))) {
          this.leaveService
            .withdrawLeave(requestId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.successMessage.set('PAGES.LEAVE.MESSAGES.REQUEST_WITHDRAWN');
                this.refreshPage();
              },
              error: (error) => this.handleError(error)
            });
        }
        break;
      case 'leave:view':
        this.leaveService
          .getRequest(requestId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (detail) => this.selectedRequest.set(detail),
            error: (error) => this.handleError(error)
          });
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.selectedRequest.set(null);
    this.clearMessages();
  }

  protected clearSelectedDetail(): void {
    this.selectedRequest.set(null);
  }

  private refreshPage(): void {
    this.selectedRequest.set(null);
    if (this.pageLayout) {
      this.pageLayout.refresh();
    }
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
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
