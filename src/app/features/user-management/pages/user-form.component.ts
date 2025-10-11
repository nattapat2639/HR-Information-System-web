import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-page-layout
      moduleKey="users"
      pageKey="create"
      pageTitleKey="PAGES.USERS.CREATE.TITLE"
      pageSubtitleKey="PAGES.USERS.CREATE.SUBTITLE"
      contentTitleKey="PAGES.USERS.CREATE.CONTENT_TITLE"
      contentSubtitleKey="PAGES.USERS.CREATE.CONTENT_SUBTITLE"
      todoKey="PAGES.USERS.CREATE.TODO"
      [actions]="actions"
      [filterFields]="filterFields"
      [tableHeaderKeys]="[]"
      [showExportButton]="false"
    ></app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.USERS.CREATE.ACTIONS.SAVE', icon: 'save', variant: 'primary' },
    { labelKey: 'PAGES.USERS.CREATE.ACTIONS.SEND_INVITE', icon: 'mail', variant: 'secondary' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'PAGES.USERS.CREATE.FIELDS.NAME',
      type: 'text',
      placeholderKey: 'PAGES.USERS.CREATE.PLACEHOLDER.NAME',
      queryKey: 'name'
    },
    {
      labelKey: 'PAGES.USERS.CREATE.FIELDS.EMAIL',
      type: 'text',
      placeholderKey: 'PAGES.USERS.CREATE.PLACEHOLDER.EMAIL',
      queryKey: 'email'
    },
    {
      labelKey: 'PAGES.USERS.CREATE.FIELDS.ROLE',
      type: 'select',
      queryKey: 'role',
      optionKeys: ['COMMON.ROLES.USER', 'COMMON.ROLES.MANAGER', 'COMMON.ROLES.ADMIN']
    }
  ];
}
