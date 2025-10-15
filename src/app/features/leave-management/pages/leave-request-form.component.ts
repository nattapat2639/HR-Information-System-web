import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LeaveManagementService, LeaveBalance, LeaveRequestDetail, LeaveType } from '../leave-management.service';
import { LeaveRequestDetailPanelComponent } from '../components/leave-request-detail-panel.component.js';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LeaveRequestDetailPanelComponent],
  template: `
    <section class="space-y-6">
      <div class="card card-padding space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">
              {{ 'PAGES.LEAVE.CREATE.TITLE' | translate }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ 'PAGES.LEAVE.CREATE.SUBTITLE' | translate }}
            </p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'COMMON.FIELDS.LEAVE_TYPE' | translate }}
            </span>
            <select
              formControlName="leaveType"
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{{ 'COMMON.SELECT.PLACEHOLDER' | translate }}</option>
              <option *ngFor="let type of leaveTypes()" [value]="type.name">
                {{ type.name }} ({{ type.defaultAllowance }} {{ 'PAGES.LEAVE.CREATE.DAYS' | translate }})
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'COMMON.FIELDS.START_DATE' | translate }}
            </span>
            <input
              formControlName="startDate"
              type="date"
              class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'COMMON.FIELDS.END_DATE' | translate }}
            </span>
            <input
              formControlName="endDate"
              type="date"
              class="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </label>

          <label class="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" formControlName="isHalfDay" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {{ 'PAGES.LEAVE.CREATE.HALF_DAY' | translate }}
          </label>

          <label class="md:col-span-2 flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'PAGES.LEAVE.CREATE.REASON' | translate }}
            </span>
            <textarea
              formControlName="reason"
              rows="4"
              class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'PAGES.LEAVE.CREATE.CONTACT' | translate }}
            </span>
            <input
              formControlName="contactDuringLeave"
              type="text"
              class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="+66-8xx-xxxx"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium text-gray-600">
              {{ 'PAGES.LEAVE.CREATE.DOCUMENT' | translate }}
            </span>
            <input
              formControlName="supportingDocumentUrl"
              type="url"
              class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://"
            />
          </label>

          <div class="md:col-span-2 flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              [disabled]="form.invalid || submitting()"
            >
              <span class="material-icons text-[18px]" *ngIf="!submitting(); else spinner">send</span>
              <ng-template #spinner>
                <span class="material-icons text-[18px] animate-spin">autorenew</span>
              </ng-template>
              {{ submitting() ? ('PAGES.LEAVE.CREATE.SUBMITTING' | translate) : ('PAGES.LEAVE.CREATE.ACTIONS.SUBMIT' | translate) }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              (click)="resetForm()"
            >
              <span class="material-icons text-[18px]">refresh</span>
              {{ 'COMMON.ACTIONS.CLEAR' | translate }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="balances().length" class="card card-padding space-y-3">
        <h2 class="text-sm font-semibold text-gray-900">
          {{ 'PAGES.LEAVE.CREATE.BALANCE_TITLE' | translate }}
        </h2>
        <div class="grid gap-3 md:grid-cols-2">
          <div *ngFor="let balance of balances()" class="rounded-lg border border-gray-200 p-3">
            <div class="flex items-center justify-between text-sm font-medium text-gray-900">
              <span>{{ balance.leaveType }}</span>
              <span>{{ balance.remaining | number:'1.0-1' }} / {{ balance.openingBalance | number:'1.0-1' }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ 'PAGES.LEAVE.CREATE.BALANCE_DETAIL' | translate:{ taken: balance.taken | number:'1.0-1', pending: balance.pending | number:'1.0-1' } }}
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="successMessage()" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
        {{ successMessage() | translate }}
      </div>
      <div *ngIf="errorMessage()" class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
        {{ errorMessage() | translate }}
      </div>

      <app-leave-request-detail-panel
        *ngIf="createdRequest() as detail"
        [request]="detail"
        (close)="createdRequest.set(null)"
      ></app-leave-request-detail-panel>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly leaveService = inject(LeaveManagementService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly form = this.fb.nonNullable.group({
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isHalfDay: [false],
    reason: ['', [Validators.required, Validators.minLength(10)]],
    contactDuringLeave: [''],
    supportingDocumentUrl: ['']
  });

  protected readonly leaveTypes = signal<LeaveType[]>([]);
  protected readonly balances = signal<LeaveBalance[]>([]);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly createdRequest = signal<LeaveRequestDetail | null>(null);

  ngOnInit(): void {
    this.loadReferenceData();
  }

  protected onSubmit(): void {
    this.clearMessages();

    if (this.form.invalid) {
      this.errorMessage.set('PAGES.LEAVE.CREATE.ERROR.INVALID_FORM');
      return;
    }

    const payload = this.form.getRawValue();

    if (payload.isHalfDay && payload.startDate !== payload.endDate) {
      this.errorMessage.set('PAGES.LEAVE.CREATE.ERROR.HALF_DAY_RANGE');
      return;
    }

    this.submitting.set(true);
    this.leaveService
      .submitLeave({
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isHalfDay: payload.isHalfDay,
        reason: payload.reason.trim(),
        contactDuringLeave: payload.contactDuringLeave?.trim() || null,
        supportingDocumentUrl: payload.supportingDocumentUrl?.trim() || null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.submitting.set(false);
          this.successMessage.set('PAGES.LEAVE.MESSAGES.REQUEST_SUBMITTED');
          this.createdRequest.set(detail);
          this.loadBalances();
          this.form.reset({ isHalfDay: false });
          setTimeout(() => {
            this.router.navigate(['/leave-management', 'my']);
          }, 1200);
        },
        error: (error) => {
          this.submitting.set(false);
          this.handleError(error);
        }
      });
  }

  protected resetForm(): void {
    this.form.reset({ isHalfDay: false });
    this.clearMessages();
  }

  private loadReferenceData(): void {
    this.leaveService
      .getLeaveTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (types) => this.leaveTypes.set(types),
        error: (error) => this.handleError(error)
      });

    this.loadBalances();
  }

  private loadBalances(): void {
    this.leaveService
      .getBalances()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (balances) => this.balances.set(balances),
        error: () => {
          // ignore balance errors silently
        }
      });
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
