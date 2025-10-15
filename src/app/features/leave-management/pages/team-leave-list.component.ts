import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FilterField,
  PageAction,
  PageActionEvent,
  PageLayoutComponent,
  PageRowActionEvent,
  PageSelectionChangeEvent
} from '../../../shared/components/page-layout/page-layout.component';
import { LeaveManagementService, LeaveRequestDetail } from '../leave-management.service';
import { LeaveRequestDetailPanelComponent } from '../components/leave-request-detail-panel.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-team-leave-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, LeaveRequestDetailPanelComponent],
  template: `
    <section class="space-y-4">
      <app-page-layout
        moduleKey="leave-management"
        pageKey="team"
        pageTitleKey="PAGES.LEAVE.TEAM.TITLE"
        pageSubtitleKey="PAGES.LEAVE.TEAM.SUBTITLE"
        contentTitleKey="PAGES.LEAVE.TEAM.CONTENT_TITLE"
        contentSubtitleKey="PAGES.LEAVE.TEAM.CONTENT_SUBTITLE"
        todoKey="PAGES.LEAVE.TEAM.TODO"
        [actions]="actions()"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="true"
        [enableSelection]="true"
        selectionKey="META.REQUEST_ID"
        (actionTriggered)="onAction($event)"
        (rowActionTriggered)="onRowAction($event)"
        (selectionChanged)="onSelectionChanged($event)"
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
export class TeamLeaveListComponent {
  private readonly leaveService = inject(LeaveManagementService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  @ViewChild(PageLayoutComponent) private pageLayout?: PageLayoutComponent;

  private readonly actionTemplate: PageAction[] = [
    {
      labelKey: 'PAGES.LEAVE.TEAM.ACTIONS.APPROVE_SELECTED',
      icon: 'check_circle',
      variant: 'primary',
      actionKey: 'team-approve-selected'
    },
    {
      labelKey: 'PAGES.LEAVE.TEAM.ACTIONS.REJECT_SELECTED',
      icon: 'highlight_off',
      variant: 'secondary',
      actionKey: 'team-reject-selected'
    }
  ];

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedRequest = signal<LeaveRequestDetail | null>(null);
  private readonly selectedKeys = signal<string[]>([]);

  protected readonly actions = computed(() =>
    this.actionTemplate.map((action) => ({
      ...action,
      disabled: this.selectedKeys().length === 0
    }))
  );

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.EMPLOYEE',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.SEARCH_EMPLOYEE',
      queryKey: 'employee'
    },
    {
      labelKey: 'COMMON.FIELDS.LEAVE_TYPE',
      type: 'select',
      queryKey: 'leaveType',
      options: [
        { labelKey: 'PAGES.LEAVE.OPTIONS.ANNUAL', value: 'Annual Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.SICK', value: 'Sick Leave' },
        { labelKey: 'PAGES.LEAVE.OPTIONS.WFH', value: 'Work From Home' },
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
        { labelKey: 'COMMON.STATUSES.REJECTED', value: 'Rejected' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.LEAVE.TEAM.COLUMNS.EMPLOYEE',
    'PAGES.LEAVE.TEAM.COLUMNS.TYPE',
    'PAGES.LEAVE.TEAM.COLUMNS.PERIOD',
    'PAGES.LEAVE.TEAM.COLUMNS.STATUS',
    'PAGES.LEAVE.TEAM.COLUMNS.REQUESTED_ON'
  ];

  protected onAction(event: PageActionEvent): void {
    this.clearMessages();
    switch (event.action.actionKey) {
      case 'team-approve-selected':
        this.performBulkDecision('approve');
        break;
      case 'team-reject-selected':
        this.performBulkDecision('reject');
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }

  protected onRowAction(event: PageRowActionEvent): void {
    const requestId = event.row.columns['META.REQUEST_ID'];
    if (!requestId) {
      return;
    }

    this.clearMessages();

    switch (event.action.actionKey) {
      case 'leave:approve':
        this.leaveService
          .approveLeave(requestId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.successMessage.set('PAGES.LEAVE.MESSAGES.REQUEST_APPROVED');
              this.refresh();
            },
            error: (error) => this.handleError(error)
          });
        break;
      case 'leave:reject':
        const comment = this.translate.instant('PAGES.LEAVE.CONFIRM.REJECT_REASON');
        this.leaveService
          .rejectLeave(requestId, comment)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.successMessage.set('PAGES.LEAVE.MESSAGES.REQUEST_REJECTED');
              this.refresh();
            },
            error: (error) => this.handleError(error)
          });
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

  protected onSelectionChanged(event: PageSelectionChangeEvent): void {
    this.selectedKeys.set(event.keys);
    if (event.keys.length === 0) {
      this.selectedRequest.set(null);
    }
  }

  private performBulkDecision(action: 'approve' | 'reject'): void {
    const keys = this.selectedKeys();
    if (keys.length === 0) {
      return;
    }

    const requests = keys.map((id) =>
      action === 'approve'
        ? this.leaveService.approveLeave(id)
        : this.leaveService.rejectLeave(id, this.translate.instant('PAGES.LEAVE.CONFIRM.REJECT_REASON'))
    );

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(
            action === 'approve'
              ? 'PAGES.LEAVE.MESSAGES.REQUEST_APPROVED'
              : 'PAGES.LEAVE.MESSAGES.REQUEST_REJECTED'
          );
          this.refresh();
        },
        error: (error) => this.handleError(error)
      });
  }

  private refresh(): void {
    this.selectedRequest.set(null);
    this.selectedKeys.set([]);
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
