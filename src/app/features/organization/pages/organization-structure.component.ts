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
  selector: 'app-organization-structure',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent, OrganizationOverviewPanelComponent, OrganizationMiniChartsComponent],
  template: `
    <section class="space-y-6">
      <app-organization-overview-panel
        [overview]="overview()"
        [loading]="overviewLoading()"
        [errorKey]="overviewError()"
        variant="structure"
      ></app-organization-overview-panel>
      <app-organization-mini-charts
        [overview]="overview()"
        variant="structure"
      ></app-organization-mini-charts>
      <app-page-layout
        moduleKey="organization"
        pageKey="structure"
        pageTitleKey="PAGES.ORGANIZATION.STRUCTURE.TITLE"
        pageSubtitleKey="PAGES.ORGANIZATION.STRUCTURE.SUBTITLE"
        contentTitleKey="PAGES.ORGANIZATION.STRUCTURE.CONTENT_TITLE"
        contentSubtitleKey="PAGES.ORGANIZATION.STRUCTURE.CONTENT_SUBTITLE"
        todoKey="PAGES.ORGANIZATION.STRUCTURE.TODO"
        [actions]="actions"
        [filterFields]="filterFields"
        [tableHeaderKeys]="tableHeaders"
        [showExportButton]="true"
        exportLabelKey="PAGES.ORGANIZATION.STRUCTURE.ACTIONS.EXPORT"
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
export class OrganizationStructureComponent implements OnInit {
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
      labelKey: 'PAGES.ORGANIZATION.STRUCTURE.ACTIONS.EXPORT',
      icon: 'download',
      variant: 'secondary',
      actionKey: 'export-structure'
    },
    {
      labelKey: 'PAGES.ORGANIZATION.STRUCTURE.ACTIONS.UPDATE',
      icon: 'edit',
      variant: 'primary',
      actionKey: 'sync-structure'
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
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.DEPARTMENT',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.LEAD',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.HEADCOUNT',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.OPEN_ROLES',
    'PAGES.ORGANIZATION.STRUCTURE.COLUMNS.FOCUS'
  ];

  protected onFiltersChanged(filters: Record<string, string>): void {
    this.currentFilters.set(filters);
    this.fetchOverview(filters);
  }

  protected onAction(event: PageActionEvent): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    switch (event.action.actionKey) {
      case 'export-structure':
        this.actionsService
          .exportStructure(event.filters)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (blob) => {
              this.triggerDownload('organization-structure.csv', blob);
              this.successMessage.set('ORGANIZATION.STRUCTURE.EXPORT_SUCCESS');
            },
            error: () => {
              this.errorMessage.set('COMMON.ERROR.ACTION_FAILED');
            }
          });
        break;
      case 'sync-structure':
        this.actionsService
          .syncStructure()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.successMessage.set(response?.message ?? 'ORGANIZATION.STRUCTURE.SYNC_SUCCESS');
              this.fetchOverview(this.currentFilters());
            },
            error: () => {
              this.errorMessage.set('COMMON.ERROR.ACTION_FAILED');
            }
          });
        break;
      default:
        this.errorMessage.set('COMMON.ERROR.ACTION_UNSUPPORTED');
    }
  }

  protected onExport(filters: Record<string, string>): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.actionsService
      .exportStructure(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          this.triggerDownload('organization-structure.csv', blob);
          this.successMessage.set('ORGANIZATION.STRUCTURE.EXPORT_SUCCESS');
        },
        error: () => {
          this.errorMessage.set('COMMON.ERROR.ACTION_FAILED');
        }
      });
  }

  private triggerDownload(fileName: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
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
