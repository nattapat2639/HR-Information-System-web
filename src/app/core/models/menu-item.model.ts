export interface MenuItem {
  labelKey: string;
  route?: string;
  icon?: string;
  type?: 'link' | 'header';
  requiredPermission?: string;
  requiredRole?: string | string[];
  menuKey?: string;
  children?: MenuItem[];
  routerLinkActiveOptions?: { exact: boolean };
}
