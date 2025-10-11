import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-export-data',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="reports"
      pageKey="exports"
      pageTitleKey="PAGES.REPORTS.EXPORT.TITLE"
      pageSubtitleKey="PAGES.REPORTS.EXPORT.SUBTITLE"
      contentTitleKey="PAGES.REPORTS.EXPORT.CONTENT_TITLE"
      contentSubtitleKey="PAGES.REPORTS.EXPORT.CONTENT_SUBTITLE"
      todoKey="PAGES.REPORTS.EXPORT.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportDataComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.REPORTS.EXPORT.ACTIONS.EXPORT_CSV', icon: 'table_chart', variant: 'primary' },
    { labelKey: 'PAGES.REPORTS.EXPORT.ACTIONS.EXPORT_XLSX', icon: 'grid_on', variant: 'secondary' },
    { labelKey: 'PAGES.REPORTS.EXPORT.ACTIONS.EXPORT_PDF', icon: 'picture_as_pdf', variant: 'ghost' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.REPORTS.EXPORT.FIELDS.DATASET',
      type: 'select',
      queryKey: 'dataset',
      optionKeys: ['PAGES.REPORTS.EXPORT.DATASETS.EMPLOYEE', 'PAGES.REPORTS.EXPORT.DATASETS.LEAVE', 'PAGES.REPORTS.EXPORT.DATASETS.PAYROLL']
    },
    {
      labelKey: 'PAGES.REPORTS.EXPORT.FIELDS.FORMAT',
      type: 'select',
      queryKey: 'format',
      optionKeys: ['PAGES.REPORTS.EXPORT.FORMATS.CSV', 'PAGES.REPORTS.EXPORT.FORMATS.XLSX', 'PAGES.REPORTS.EXPORT.FORMATS.PDF']
    }
  ];
}
