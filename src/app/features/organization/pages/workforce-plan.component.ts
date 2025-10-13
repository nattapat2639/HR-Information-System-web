import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterField, PageAction, PageActionEvent, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { OrganizationActionsService } from '../organization-actions.service';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationOverviewPanelComponent } from '../components/organization-overview-panel.component';
import { OrganizationMiniChartsComponent } from '../components/organization-mini-charts.component';
import { OrganizationOverview } from '../models/organization-overview.model';

@Component({
  selector: 'app-workforce-plan',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, OrganizationOverviewPanelComponent, OrganizationMiniChartsComponent],
  template: `
    <section class="space-y-6">
      <app-organization-overview-panel
        [overview]="overview()"
        [loading]="overviewLoading()"
        [errorKey]="overviewError()"
        variant="workforce"
      ></app-organization-overview-panel>
      <app-organization-mini-charts
        [overview]="overview()"
        variant="workforce"
      ></app-organization-mini-charts>
      <app-page-layout
        moduleKey="organization"
        pageKey="workforce-plan"
        pageTitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.TITLE"
        pageSubtitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.SUBTITLE"
        contentTitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.CONTENT_TITLE"
        contentSubtitleKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.CONTENT_SUBTITLE"
        todoKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.TODO"
        [actions]="actions"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="true"
        exportLabelKey="PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.EXPORT"
        (actionTriggered)="onAction($event)"
        (filtersChanged)="onFiltersChanged($event)"
        (exportRequested)="onExport($event)"
      ></app-page-layout>
      <div *ngIf="successMessage()" class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
        {{ successMessage() | translate }}
      </div>
      <div *ngIf="errorMessage()" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        {{ errorMessage() | translate }}
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkforcePlanComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actionsService = inject(OrganizationActionsService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly currentFilters = signal<Record<string, string>>({});
  protected readonly overview = signal<OrganizationOverview | null>(null);
  protected readonly overviewLoading = signal(false);
  protected readonly overviewError = signal<string | null>(null);

  ngOnInit(): void {
    this.onFiltersChanged({});
  }

  protected readonly actions: PageAction[] = [
    {
      labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.EXPORT',
      icon: 'download',
      variant: 'secondary',
      actionKey: 'export-plan'
    },
    {
      labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.PUBLISH',
      icon: 'publish',
      variant: 'primary',
      actionKey: 'publish-plan'
    },
    {
      labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ACTIONS.REQUEST',
      icon: 'group_add',
      variant: 'ghost',
      actionKey: 'request-headcount'
    }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      options: [
        { labelKey: 'COMMON.DEPARTMENTS.HR', value: 'People Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.IT', value: 'Technology' },
        { labelKey: 'COMMON.DEPARTMENTS.FINANCE', value: 'Finance' },
        { labelKey: 'COMMON.DEPARTMENTS.MARKETING', value: 'Marketing' },
        { labelKey: 'COMMON.DEPARTMENTS.CUSTOMER_SUCCESS', value: 'Customer Success' },
        { labelKey: 'COMMON.DEPARTMENTS.OPERATIONS', value: 'Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.SALES', value: 'Sales' },
        { labelKey: 'COMMON.DEPARTMENTS.DATA_ANALYTICS', value: 'Data & Analytics' }
      ]
    },
    {
      labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.FILTERS.ATTRITION',
      type: 'select',
      queryKey: 'attrition',
      options: [
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.LOW', value: 'Low' },
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.MEDIUM', value: 'Medium' },
        { labelKey: 'PAGES.ORGANIZATION.WORKFORCE_PLAN.ATTRITION.HIGH', value: 'High' }
      ]
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.DEPARTMENT',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.CURRENT_HEADCOUNT',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.APPROVED_Q3',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.ATTRITION_RISK',
    'PAGES.ORGANIZATION.WORKFORCE_PLAN.COLUMNS.NEXT_HIRE'
  ];

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.currentFilters.set(filters);
    this.fetchOverview(filters);
  }

  protected onAction(event: PageActionEvent): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    switch (event.action.actionKey) {
      case 'export-plan':
        this.actionsService
          .exportWorkforcePlan(event.filters)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (blob) => {
              this.triggerDownload('workforce-plan.csv', blob);
              this.successMessage.set('ORGANIZATION.WORKFORCE_PLAN.EXPORT_SUCCESS');
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'publish-plan':
        this.actionsService
          .publishPlan()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'ORGANIZATION.WORKFORCE_PLAN.PUBLISH_SUCCESS');
              this.fetchOverview(this.currentFilters());
            },
            error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
          });
        break;
      case 'request-headcount':
        this.handleHeadcountRequest(event);
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.actionsService
      .exportWorkforcePlan(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('workforce-plan.csv', blob);
          this.successMessage.set('ORGANIZATION.WORKFORCE_PLAN.EXPORT_SUCCESS');
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  private handleHeadcountRequest(event: PageActionEvent): void {
    const department = event.filters['department'] ?? 'Technology';
    const attrition = event.filters['attrition'] ?? 'Medium';
    const requestedHeadcount = attrition === 'High' ? 2 : 1;
    const justification = `Additional capacity requested due to ${attrition.toLowerCase()} attrition risk.`;

    this.actionsService
      .requestHeadcount({
        department,
        requestedHeadcount,
        justification,
        requestedBy: 'People Operations'
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.successMessage.set(response?.message ?? 'ORGANIZATION.WORKFORCE_PLAN.REQUEST_CREATED');
          this.fetchOverview(this.currentFilters());
        },
        error: () => this.errorMessage.set('COMMON.ERROR.ACTION_FAILED')
      });
  }

  private triggerDownload(fileName: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  private fetchOverview(filters: Record<string, string>): void {
    this.overviewLoading.set(true);
    this.overviewError.set(null);

    this.actionsService
      .getOverview(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.overview.set(response);
          this.overviewLoading.set(false);
        },
        error: () => {
          this.overviewError.set('COMMON.ERROR.LOAD_FAILED');
          this.overviewLoading.set(false);
        }
      });
  }
}
