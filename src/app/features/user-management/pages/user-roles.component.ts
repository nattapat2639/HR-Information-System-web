import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="users"
      pageKey="roles"
      pageTitleKey="PAGES.USERS.ROLES.TITLE"
      pageSubtitleKey="PAGES.USERS.ROLES.SUBTITLE"
      contentTitleKey="PAGES.USERS.ROLES.CONTENT_TITLE"
      contentSubtitleKey="PAGES.USERS.ROLES.CONTENT_SUBTITLE"
      todoKey="PAGES.USERS.ROLES.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="tableHeaders"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRolesComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.USERS.ROLES.ACTIONS.ADD_ROLE', icon: 'add', variant: 'primary' },
    { labelKey: 'PAGES.USERS.ROLES.ACTIONS.MANAGE_PERMISSIONS', icon: 'security', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.ROLE',
      type: 'select',
      queryKey: 'role',
      optionKeys: ['COMMON.ROLES.USER', 'COMMON.ROLES.MANAGER', 'COMMON.ROLES.ADMIN']
    }
  ];

  protected readonly tableHeaders: string[] = [
    'PAGES.USERS.ROLES.COLUMNS.ROLE',
    'PAGES.USERS.ROLES.COLUMNS.DESCRIPTION',
    'PAGES.USERS.ROLES.COLUMNS.ASSIGNED_USERS'
  ];
}
