import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrganizationOverview, DepartmentPlanSummary } from '../models/organization-overview.model';

@Component({
  selector: 'app-organization-mini-charts',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="grid gap-4 xl:grid-cols-2">
      <div class="card card-padding">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">
            {{
              variant === 'structure'
                ? ('PAGES.ORGANIZATION.INSIGHTS.CHARTS.STRUCTURE_DONUT_TITLE' | translate)
                : ('PAGES.ORGANIZATION.INSIGHTS.CHARTS.WORKFORCE_DONUT_TITLE' | translate)
            }}
          </h3>
          <span class="text-xs text-gray-500">
            {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.DONUT_SUBTITLE' | translate }}
          </span>
        </div>
        <div class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div
            class="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-slate-100"
            [style.background]="buildDonutBackground()"
          >
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ occupancyPercent() }}%</p>
                <p class="text-[11px] text-gray-500">
                  {{
                    variant === 'structure'
                      ? ('PAGES.ORGANIZATION.INSIGHTS.CHARTS.LABEL_CURRENT' | translate)
                      : ('PAGES.ORGANIZATION.INSIGHTS.CHARTS.LABEL_UTILIZATION' | translate)
                  }}
                </p>
              </div>
            </div>
          </div>
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-6">
              <dt class="flex items-center gap-2">
                <span class="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.PLANNED' | translate }}
              </dt>
              <dd class="font-semibold text-gray-900">
                {{ overview?.totalApprovedHeadcount | number }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-6">
              <dt class="flex items-center gap-2">
                <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.ACTUAL' | translate }}
              </dt>
              <dd class="font-semibold text-gray-900">
                {{ overview?.totalHeadcount | number }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-6 text-xs text-gray-500">
              <dt>{{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.DELTA' | translate }}</dt>
              <dd class="font-medium text-gray-700">
                {{ delta() }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="card card-padding">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEATMAP_TITLE' | translate }}
          </h3>
          <span class="text-xs text-gray-500">
            {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEATMAP_SUBTITLE' | translate }}
          </span>
        </div>
        <div *ngIf="heatmapData.length; else heatmapEmpty" class="mt-4 grid gap-3 md:grid-cols-2">
          <div
            *ngFor="let bucket of heatmapData; trackBy: trackByDepartment"
            class="rounded-lg border border-gray-200 p-3 transition hover:border-blue-300 hover:shadow-sm"
          >
            <p class="text-sm font-semibold text-gray-900">{{ bucket.department }}</p>
            <p class="text-[11px] text-gray-500">
              {{
                'PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEATMAP_HEADCOUNT'
                  | translate:{ current: bucket.currentHeadcount | number, approved: bucket.approvedHeadcount | number }
              }}
            </p>
            <div class="mt-3">
              <div class="flex items-center justify-between text-xs font-medium text-gray-600">
                <span>{{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEATMAP_OPEN_ROLES' | translate }}</span>
                <span>{{ bucket.openRoles | number }}</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  class="h-2 rounded-full transition-all"
                  [style.width.%]="bucket.fill"
                  [style.background]="bucket.color"
                ></div>
              </div>
            </div>
            <p class="mt-3 inline-flex items-center gap-2 text-[11px] text-gray-500">
              <span class="inline-flex h-2 w-2 rounded-full" [style.background]="bucket.attritionColor"></span>
              {{ bucket.attritionLabel | translate }}
            </p>
          </div>
        </div>
        <ng-template #heatmapEmpty>
          <div class="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
            {{ 'PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEATMAP_EMPTY' | translate }}
          </div>
        </ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationMiniChartsComponent {
  @Input() overview: OrganizationOverview | null = null;
  @Input() variant: 'structure' | 'workforce' = 'structure';

  constructor(private readonly translateService: TranslateService) {}

  protected get heatmapData(): Array<
    DepartmentPlanSummary & { fill: number; color: string; attritionColor: string; attritionLabel: string }
  > {
    if (!this.overview) {
      return [];
    }

    const plans = [...this.overview.departmentPlans].sort((a, b) => b.openRoles - a.openRoles);
    const topPlans = plans.slice(0, 6);
    const maxOpen = Math.max(...topPlans.map((item) => item.openRoles), 1);

    return topPlans.map((plan) => {
      const ratio = Math.min(100, Math.round((plan.openRoles / maxOpen) * 100));
      return {
        ...plan,
        fill: ratio,
        color: this.resolveHeatColor(ratio),
        attritionColor: this.attritionColor(plan.attritionRisk),
        attritionLabel: this.buildAttritionLabelKey(plan.attritionRisk)
      };
    });
  }

  protected buildDonutBackground(): string {
    const percent = this.occupancyPercent();
    const plannedColor = '#2563eb';
    const actualColor = '#10b981';
    const backgroundColor = '#e2e8f0';
    const clamped = Math.min(100, percent);

    if (percent <= 100) {
      return `conic-gradient(${actualColor} 0 ${clamped}%, ${plannedColor} ${clamped}% 100%, ${backgroundColor} 0 0)`;
    }

    return `conic-gradient(${actualColor} 0 100%), radial-gradient(circle, transparent 60%, #f97316 60% 100%)`;
  }

  protected occupancyPercent(): number {
    const approved = this.overview?.totalApprovedHeadcount ?? 0;
    if (approved <= 0) {
      return 0;
    }

    const actual = this.overview?.totalHeadcount ?? 0;
    return Math.min(200, Math.round((actual / approved) * 100));
  }

  protected delta(): string {
    const approved = this.overview?.totalApprovedHeadcount ?? 0;
    const actual = this.overview?.totalHeadcount ?? 0;
    const diff = actual - approved;

    if (diff === 0) {
      return this.translate('PAGES.ORGANIZATION.INSIGHTS.CHARTS.DELTA_ON_PLAN');
    }

    const sign = diff > 0 ? '+' : '-';
    return `${sign}${Math.abs(diff)} ${this.translate('PAGES.ORGANIZATION.INSIGHTS.CHARTS.HEADCOUNT_UNITS')}`;
  }

  protected trackByDepartment(_: number, item: DepartmentPlanSummary): string {
    return item.department;
  }

  private resolveHeatColor(percent: number): string {
    if (percent >= 75) {
      return '#ef4444';
    }
    if (percent >= 50) {
      return '#f59e0b';
    }
    if (percent >= 25) {
      return '#10b981';
    }
    return '#38bdf8';
  }

  private attritionColor(risk: string | null | undefined): string {
    switch ((risk ?? 'unknown').toLowerCase()) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f97316';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  }

  private buildAttritionLabelKey(risk: string | null | undefined): string {
    const normalized = (risk ?? 'UNKNOWN').toUpperCase();
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

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
