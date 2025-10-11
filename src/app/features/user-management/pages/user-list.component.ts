import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="users"
      pageKey="list"
      pageTitleKey="PAGES.USERS.LIST.TITLE"
      pageSubtitleKey="PAGES.USERS.LIST.SUBTITLE"
      contentTitleKey="PAGES.USERS.LIST.CONTENT_TITLE"
      contentSubtitleKey="PAGES.USERS.LIST.CONTENT_SUBTITLE"
      todoKey="PAGES.USERS.LIST.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="true"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.USERS.LIST.ACTIONS.CREATE', icon: 'person_add', variant: 'primary' },
    { labelKey: 'PAGES.USERS.LIST.ACTIONS.BULK_IMPORT', icon: 'file_upload', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.KEYWORD',
      type: 'text',
      placeholderKey: 'COMMON.PLACEHOLDER.ENTER_KEYWORD',
      queryKey: 'keyword'
    },
    {
      labelKey: 'COMMON.FIELDS.ROLE',
      type: 'select',
      queryKey: 'role',
      optionKeys: ['COMMON.ROLES.USER', 'COMMON.ROLES.MANAGER', 'COMMON.ROLES.ADMIN']
    },
    {
      labelKey: 'COMMON.FIELDS.STATUS',
      type: 'select',
      queryKey: 'status',
      optionKeys: ['COMMON.STATUSES.ACTIVE', 'COMMON.STATUSES.SUSPENDED']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.USERS.LIST.COLUMNS.NAME',
    'PAGES.USERS.LIST.COLUMNS.EMAIL',
    'PAGES.USERS.LIST.COLUMNS.ROLE',
    'PAGES.USERS.LIST.COLUMNS.STATUS'
  ];
}
