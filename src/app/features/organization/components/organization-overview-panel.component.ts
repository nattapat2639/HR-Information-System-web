import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  AttritionBreakdown,
  DepartmentPlanSummary,
  FocusAreaSummary,
  OrganizationOverview
} from '../models/organization-overview.model';

@Component({
  selector: 'app-organization-overview-panel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="space-y-4">
      <div *ngIf="loading" class="card card-padding flex items-center justify-center py-12">
        <span class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></span>
      </div>
      <div
        *ngIf="!loading && errorKey"
        class="card card-padding border border-red-200 bg-red-50 text-sm text-red-700"
      >
        {{ errorKey | translate }}
      </div>
      <ng-container *ngIf="!loading && !errorKey && overview as data">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="card card-padding">
            <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.HEADCOUNT' | translate }}
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">
              {{ data.totalHeadcount | number }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.APPROVED' | translate:{ count: data.totalApprovedHeadcount | number } }}
            </p>
          </div>
          <div class="card card-padding">
            <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.OPEN_ROLES' | translate }}
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">
              {{ data.totalOpenRoles | number }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.OPEN_ROLES_HINT' | translate }}
            </p>
          </div>
          <div class="card card-padding">
            <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.DEPARTMENTS' | translate }}
            </p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">
              {{ data.departmentCount | number }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.DEPARTMENTS_HINT' | translate }}
            </p>
          </div>
          <div class="card card-padding">
            <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.LAST_SYNC' | translate }}
            </p>
            <p class="mt-2 text-base font-semibold text-gray-900">
              <ng-container *ngIf="data.lastSyncedAtUtc; else noSync">
                {{ data.lastSyncedAtUtc | date:'medium' }}
              </ng-container>
              <ng-template #noSync>
                {{ 'PAGES.ORGANIZATION.INSIGHTS.NO_SYNC' | translate }}
              </ng-template>
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.METRICS.TIMEZONE_HINT' | translate }}
            </p>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
          <div class="card card-padding xl:col-span-2">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">
                {{ 'PAGES.ORGANIZATION.INSIGHTS.ATTRITION.TITLE' | translate }}
              </h3>
              <span class="text-xs text-gray-500">
                {{ 'PAGES.ORGANIZATION.INSIGHTS.ATTRITION.SUBTITLE' | translate }}
              </span>
            </div>
            <div *ngIf="data.attritionBreakdown.length; else attritionEmpty" class="mt-4 space-y-4">
              <div
                *ngFor="let item of data.attritionBreakdown; trackBy: trackByRiskLevel"
                class="space-y-2"
              >
                <div class="flex items-center justify-between text-xs font-medium text-gray-600">
                  <span class="inline-flex items-center gap-2">
                    <span class="inline-flex h-2 w-2 rounded-full" [ngClass]="attritionDotClass(item.riskLevel)"></span>
                    {{ buildAttritionLabelKey(item.riskLevel) | translate }}
                  </span>
                  <span>{{ item.count | number }}</span>
                </div>
                <div class="h-2 rounded-full bg-gray-100">
                  <div
                    class="h-2 rounded-full transition-all"
                    [ngClass]="attritionBarClass(item.riskLevel)"
                    [style.width.%]="attritionPercentage(item.count)"
                  ></div>
                </div>
              </div>
            </div>
            <ng-template #attritionEmpty>
              <div class="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                {{ 'PAGES.ORGANIZATION.INSIGHTS.ATTRITION.EMPTY' | translate }}
              </div>
            </ng-template>
          </div>

          <div class="card card-padding">
            <h3 class="text-sm font-semibold text-gray-900">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.FOCUS.TITLE' | translate }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.FOCUS.SUBTITLE' | translate }}
            </p>
            <ul *ngIf="getFocusAreas().length; else focusEmpty" class="mt-4 space-y-3">
              <li
                *ngFor="let focus of getFocusAreas(); trackBy: trackByFocusArea"
                class="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
              >
                <span class="text-sm font-medium text-gray-700">{{ focus.focusArea }}</span>
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  {{ 'PAGES.ORGANIZATION.INSIGHTS.FOCUS.DEPARTMENTS' | translate:{ count: focus.departmentCount } }}
                </span>
              </li>
            </ul>
            <ng-template #focusEmpty>
              <div class="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                {{ 'PAGES.ORGANIZATION.INSIGHTS.FOCUS.EMPTY' | translate }}
              </div>
            </ng-template>
          </div>
        </div>

        <div class="card card-padding">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">
              {{
                variant === 'structure'
                  ? ('PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.STRUCTURE_TITLE' | translate)
                  : ('PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.WORKFORCE_TITLE' | translate)
              }}
            </h3>
            <span class="text-xs text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.SUBTITLE' | translate }}
            </span>
          </div>

          <ng-container *ngIf="getDepartmentPlans().length; else departmentsEmpty">
            <div *ngIf="variant === 'structure'; else workforceView" class="mt-4 space-y-4">
              <div
                *ngFor="let plan of getDepartmentPlans(); trackBy: trackByDepartment"
                class="rounded-md border border-gray-200 p-4"
              >
                <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ plan.department }}</p>
                    <p class="text-xs text-gray-500">
                      {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.LEAD' | translate }}: {{ plan.lead }}
                    </p>
                  </div>
                  <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
                    {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.OPEN_ROLES_SHORT' | translate:{ count: plan.openRoles } }}
                  </span>
                </div>
                <div class="mt-3 grid gap-2 md:grid-cols-2">
                  <div class="text-xs text-gray-600">
                    <span class="font-semibold text-gray-700">
                      {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.FOCUS' | translate }}:
                    </span>
                    <span class="ml-1">{{ plan.focus || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <span class="inline-flex h-2 w-2 rounded-full" [ngClass]="attritionDotClass(plan.attritionRisk)"></span>
                    {{ buildAttritionLabelKey(plan.attritionRisk) | translate }}
                  </div>
                </div>
              </div>
            </div>
            <ng-template #workforceView>
              <div class="mt-4 space-y-4">
                <div
                  *ngFor="let plan of getDepartmentPlans(); trackBy: trackByDepartment"
                  class="rounded-md border border-gray-200 p-4"
                >
                  <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p class="text-sm font-semibold text-gray-900">{{ plan.department }}</p>
                      <p class="text-xs text-gray-500">
                        {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.LEAD' | translate }}: {{ plan.lead }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ plan.currentHeadcount | number }} /
                        {{ plan.approvedHeadcount | number }}
                      </p>
                      <p class="text-[11px] text-gray-500">
                        {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.CAPACITY' | translate }} {{ headcountPercentage(plan) }}%
                      </p>
                    </div>
                  </div>
                  <div class="mt-3 h-2 w-full rounded-full bg-gray-100">
                    <div
                      class="h-2 rounded-full transition-all"
                      [ngClass]="capacityBarClass(plan)"
                      [style.width.%]="headcountFill(plan)"
                    ></div>
                  </div>
                  <div class="mt-2 flex flex-col gap-2 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
                    <span class="inline-flex items-center gap-2">
                      <span class="font-semibold text-gray-700">
                        {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.ATTRITION' | translate }}
                      </span>
                      <span class="inline-flex h-2 w-2 rounded-full" [ngClass]="attritionDotClass(plan.attritionRisk)"></span>
                      {{ buildAttritionLabelKey(plan.attritionRisk) | translate }}
                    </span>
                    <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
                      {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.OPEN_ROLES_SHORT' | translate:{ count: plan.openRoles } }}
                    </span>
                  </div>
                </div>
              </div>
            </ng-template>
          </ng-container>
          <ng-template #departmentsEmpty>
            <div class="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
              {{ 'PAGES.ORGANIZATION.INSIGHTS.DEPARTMENTS.EMPTY' | translate }}
            </div>
          </ng-template>
        </div>
      </ng-container>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationOverviewPanelComponent {
  @Input() overview: OrganizationOverview | null = null;
  @Input() loading = false;
  @Input() errorKey: string | null = null;
  @Input() variant: 'structure' | 'workforce' = 'structure';

  protected trackByRiskLevel(_: number, item: AttritionBreakdown): string {
    return item.riskLevel;
  }

  protected trackByFocusArea(_: number, item: FocusAreaSummary): string {
    return item.focusArea;
  }

  protected trackByDepartment(_: number, item: DepartmentPlanSummary): string {
    return item.department;
  }

  protected attritionPercentage(count: number): number {
    const total = this.attritionTotal;
    if (total === 0) {
      return 0;
    }

    return Math.round((count / total) * 100);
  }

  protected attritionBarClass(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  }

  protected attritionDotClass(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  }

  protected capacityBarClass(plan: DepartmentPlanSummary): string {
    const percentage = this.headcountPercentage(plan);
    if (percentage >= 110) {
      return 'bg-purple-500';
    }
    if (percentage >= 90) {
      return 'bg-emerald-500';
    }
    if (percentage >= 70) {
      return 'bg-blue-500';
    }
    if (percentage >= 50) {
      return 'bg-amber-500';
    }
    return 'bg-red-500';
  }

  protected headcountPercentage(plan: DepartmentPlanSummary): number {
    if (!plan.approvedHeadcount || plan.approvedHeadcount <= 0) {
      return 0;
    }

    const ratio = (plan.currentHeadcount / plan.approvedHeadcount) * 100;
    return Math.max(0, Math.min(140, Math.round(ratio)));
  }

  protected headcountFill(plan: DepartmentPlanSummary): number {
    return Math.min(100, this.headcountPercentage(plan));
  }

  protected buildAttritionLabelKey(risk: string): string {
    const normalized = (risk || 'UNKNOWN').toUpperCase();
    switch (normalized) {
      case 'LOW':
      case 'MEDIUM':
      case 'HIGH':
      case 'UNKNOWN':
        return `PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.${normalized}`;
      default:
        return normalized;
    }
  }

  protected getDepartmentPlans(): DepartmentPlanSummary[] {
    return (this.overview?.departmentPlans ?? []).slice(0, this.variant === 'structure' ? 6 : 5);
  }

  protected getFocusAreas(): FocusAreaSummary[] {
    return (this.overview?.focusAreas ?? []).slice(0, 5);
  }

  private get attritionTotal(): number {
    return (this.overview?.attritionBreakdown ?? []).reduce((sum, item) => sum + item.count, 0);
  }
}
