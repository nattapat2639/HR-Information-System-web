import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LeaveRequestDetail } from '../leave-management.service';

@Component({
  selector: 'app-leave-request-detail-panel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50" (click)="onBackdropClick($event)">
      <div class="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ 'PAGES.LEAVE.DETAIL.TITLE' | translate }}
            </h2>
            <p class="text-sm text-gray-600">{{ request.reference }}</p>
          </div>
          <button
            type="button"
            class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            (click)="close.emit()"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="max-h-[calc(90vh-4rem)] overflow-y-auto">
          <div class="space-y-6 p-6">
            <!-- Status Badge -->
            <div class="flex items-center space-x-2">
              <span 
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                [ngClass]="{
                  'bg-green-100 text-green-800': request.status === 'Approved',
                  'bg-yellow-100 text-yellow-800': request.status === 'Pending',
                  'bg-red-100 text-red-800': request.status === 'Rejected',
                  'bg-gray-100 text-gray-800': !['Approved', 'Pending', 'Rejected'].includes(request.status)
                }"
              >
                {{ ('PAGES.LEAVE.STATUS.' + request.status.toUpperCase()) | translate }}
              </span>
              <span *ngIf="request.isHalfDay" class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {{ 'PAGES.LEAVE.HALF_DAY' | translate }}
              </span>
            </div>

            <!-- Employee Information -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <h3 class="text-base font-medium text-gray-900">
                  {{ 'PAGES.LEAVE.DETAIL.EMPLOYEE_INFO' | translate }}
                </h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.EMPLOYEE_NAME' | translate }}</dt>
                    <dd class="text-sm text-gray-900">{{ request.employeeName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.LEAVE_TYPE' | translate }}</dt>
                    <dd class="text-sm text-gray-900">{{ request.leaveType }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Leave Dates -->
              <div class="space-y-4">
                <h3 class="text-base font-medium text-gray-900">
                  {{ 'PAGES.LEAVE.DETAIL.LEAVE_DATES' | translate }}
                </h3>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.START_DATE' | translate }}</dt>
                    <dd class="text-sm text-gray-900">{{ request.startDate | date: 'mediumDate' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.END_DATE' | translate }}</dt>
                    <dd class="text-sm text-gray-900">{{ request.endDate | date: 'mediumDate' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.REQUESTED_ON' | translate }}</dt>
                    <dd class="text-sm text-gray-900">{{ request.requestedOn | date: 'medium' }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Reason -->
            <div *ngIf="request.reason" class="space-y-2">
              <h3 class="text-base font-medium text-gray-900">
                {{ 'COMMON.FIELDS.REASON' | translate }}
              </h3>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ request.reason }}</p>
            </div>

            <!-- Contact Information -->
            <div *ngIf="request.contactDuringLeave" class="space-y-2">
              <h3 class="text-base font-medium text-gray-900">
                {{ 'PAGES.LEAVE.DETAIL.CONTACT_DURING_LEAVE' | translate }}
              </h3>
              <p class="text-sm text-gray-700">{{ request.contactDuringLeave }}</p>
            </div>

            <!-- Supporting Document -->
            <div *ngIf="request.supportingDocumentUrl" class="space-y-2">
              <h3 class="text-base font-medium text-gray-900">
                {{ 'PAGES.LEAVE.DETAIL.SUPPORTING_DOCUMENT' | translate }}
              </h3>
              <a
                [href]="request.supportingDocumentUrl"
                target="_blank"
                class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ 'PAGES.LEAVE.DETAIL.VIEW_DOCUMENT' | translate }}
              </a>
            </div>

            <!-- Approval Information -->
            <div *ngIf="request.approverId && request.approverName" class="space-y-4">
              <h3 class="text-base font-medium text-gray-900">
                {{ 'PAGES.LEAVE.DETAIL.APPROVAL_INFO' | translate }}
              </h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.APPROVER' | translate }}</dt>
                  <dd class="text-sm text-gray-900">{{ request.approverName }}</dd>
                </div>
                <div *ngIf="request.decisionOn">
                  <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.DECISION_DATE' | translate }}</dt>
                  <dd class="text-sm text-gray-900">{{ request.decisionOn | date: 'medium' }}</dd>
                </div>
                <div *ngIf="request.managerComment">
                  <dt class="text-sm font-medium text-gray-500">{{ 'COMMON.FIELDS.MANAGER_COMMENT' | translate }}</dt>
                  <dd class="text-sm text-gray-700 whitespace-pre-wrap">{{ request.managerComment }}</dd>
                </div>
              </dl>
            </div>

            <!-- Timeline -->
            <div *ngIf="request.timeline && request.timeline.length > 0" class="space-y-4">
              <h3 class="text-base font-medium text-gray-900">
                {{ 'PAGES.LEAVE.DETAIL.TIMELINE' | translate }}
              </h3>
              <div class="flow-root">
                <ul class="-mb-8">
                  <li *ngFor="let entry of request.timeline; let isLast = last" class="relative">
                    <div *ngIf="!isLast" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white">
                          <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p class="text-sm text-gray-900">
                            <span class="font-medium">{{ entry.actor }}</span> {{ entry.action }}
                          </p>
                          <p *ngIf="entry.remarks" class="mt-1 text-sm text-gray-600">{{ entry.remarks }}</p>
                        </div>
                        <div class="whitespace-nowrap text-right text-sm text-gray-500">
                          {{ entry.occurredOn | date: 'short' }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestDetailPanelComponent {
  @Input({ required: true }) request!: LeaveRequestDetail;
  @Output() close = new EventEmitter<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
