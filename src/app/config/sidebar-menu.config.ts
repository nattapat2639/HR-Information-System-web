import { MenuItem } from '../core/models/menu-item.model';

export const SIDEBAR_MENU: MenuItem[] = [
  {
    labelKey: 'SIDEBAR.DASHBOARD',
    route: '/dashboard',
    icon: 'dashboard',
    routerLinkActiveOptions: { exact: true }
  },
  {
    labelKey: 'SIDEBAR.ORGANIZATION.TITLE',
    icon: 'account_tree',
    menuKey: 'organization',
    requiredRole: ['Manager', 'Admin'],
    children: [
      {
        labelKey: 'SIDEBAR.ORGANIZATION.STRUCTURE',
        route: '/organization/structure',
        icon: 'schema'
      },
      {
        labelKey: 'SIDEBAR.ORGANIZATION.WORKFORCE_PLAN',
        route: '/organization/workforce-plan',
        icon: 'stacked_bar_chart'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.EMPLOYEE_RECORDS.TITLE',
    icon: 'people',
    menuKey: 'employee-records',
    children: [
      {
        labelKey: 'SIDEBAR.EMPLOYEE_RECORDS.ALL',
        route: '/employee-records/all',
        icon: 'list_alt'
      },
      {
        labelKey: 'SIDEBAR.EMPLOYEE_RECORDS.PROFILE',
        route: '/employee-records/profile',
        icon: 'badge'
      },
      {
        labelKey: 'SIDEBAR.EMPLOYEE_RECORDS.SEARCH',
        route: '/employee-records/search',
        icon: 'search'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.LEAVE_MANAGEMENT.TITLE',
    icon: 'event',
    menuKey: 'leave-management',
    children: [
      {
        labelKey: 'SIDEBAR.LEAVE_MANAGEMENT.MY_REQUESTS',
        route: '/leave-management/my',
        icon: 'assignment'
      },
      {
        labelKey: 'SIDEBAR.LEAVE_MANAGEMENT.CREATE_REQUEST',
        route: '/leave-management/create',
        icon: 'add_circle'
      },
      {
        labelKey: 'SIDEBAR.LEAVE_MANAGEMENT.TEAM_REQUESTS',
        route: '/leave-management/team',
        icon: 'group',
        requiredRole: ['Manager', 'Admin'],
        requiredPermission: 'team:approve'
      },
      {
        labelKey: 'SIDEBAR.LEAVE_MANAGEMENT.HISTORY',
        route: '/leave-management/history',
        icon: 'history'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.PAYROLL.TITLE',
    icon: 'payments',
    menuKey: 'payroll-management',
    children: [
      {
        labelKey: 'SIDEBAR.PAYROLL.MY_PAYSLIP',
        route: '/payroll/my',
        icon: 'receipt_long'
      },
      {
        labelKey: 'SIDEBAR.PAYROLL.SUMMARY',
        route: '/payroll/summary',
        icon: 'summarize',
        requiredRole: ['Manager', 'Admin']
      },
      {
        labelKey: 'SIDEBAR.PAYROLL.GENERATE',
        route: '/payroll/generate',
        icon: 'print',
        requiredRole: 'Admin'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.PERFORMANCE.TITLE',
    icon: 'insights',
    menuKey: 'performance-management',
    children: [
      {
        labelKey: 'SIDEBAR.PERFORMANCE.MY_REVIEWS',
        route: '/performance/my',
        icon: 'star'
      },
      {
        labelKey: 'SIDEBAR.PERFORMANCE.TEAM_REVIEWS',
        route: '/performance/team',
        icon: 'groups',
        requiredRole: ['Manager', 'Admin'],
        requiredPermission: 'team:approve'
      },
      {
        labelKey: 'SIDEBAR.PERFORMANCE.CREATE',
        route: '/performance/create',
        icon: 'add_task',
        requiredRole: ['Manager', 'Admin'],
        requiredPermission: 'team:approve'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.TRAINING.TITLE',
    icon: 'school',
    menuKey: 'training',
    children: [
      {
        labelKey: 'SIDEBAR.TRAINING.CALENDAR',
        route: '/training/calendar',
        icon: 'event_available'
      },
      {
        labelKey: 'SIDEBAR.TRAINING.PROGRESS',
        route: '/training/progress',
        icon: 'trending_up'
      },
      {
        labelKey: 'SIDEBAR.TRAINING.REQUESTS',
        route: '/training/requests',
        icon: 'assignment_ind'
      },
      {
        labelKey: 'SIDEBAR.TRAINING.CREATE_PROGRAM',
        route: '/training/create',
        icon: 'library_add',
        requiredRole: ['Manager', 'Admin']
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.ENGAGEMENT.TITLE',
    icon: 'campaign',
    menuKey: 'employee-engagement',
    children: [
      {
        labelKey: 'SIDEBAR.ENGAGEMENT.SURVEYS',
        route: '/engagement/surveys',
        icon: 'poll'
      },
      {
        labelKey: 'SIDEBAR.ENGAGEMENT.RESULTS',
        route: '/engagement/results',
        icon: 'analytics',
        requiredRole: ['Manager', 'Admin']
      },
      {
        labelKey: 'SIDEBAR.ENGAGEMENT.CREATE',
        route: '/engagement/create',
        icon: 'add_chart',
        requiredRole: 'Admin'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.REPORTS.TITLE',
    icon: 'insert_chart',
    menuKey: 'reports',
    requiredRole: 'Admin',
    requiredPermission: 'reports:access',
    children: [
      {
        labelKey: 'SIDEBAR.REPORTS.EMPLOYEE',
        route: '/reports/employee',
        icon: 'badge'
      },
      {
        labelKey: 'SIDEBAR.REPORTS.LEAVE',
        route: '/reports/leave',
        icon: 'event_note'
      },
      {
        labelKey: 'SIDEBAR.REPORTS.PAYROLL',
        route: '/reports/payroll',
        icon: 'request_quote'
      },
      {
        labelKey: 'SIDEBAR.REPORTS.PERFORMANCE',
        route: '/reports/performance',
        icon: 'leaderboard'
      },
      {
        labelKey: 'SIDEBAR.REPORTS.EXPORT',
        route: '/reports/exports',
        icon: 'file_download'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.USER_MANAGEMENT.TITLE',
    icon: 'manage_accounts',
    menuKey: 'user-management',
    requiredRole: 'Admin',
    requiredPermission: 'users:manage',
    children: [
      {
        labelKey: 'SIDEBAR.USER_MANAGEMENT.LIST',
        route: '/users/list',
        icon: 'people_outline'
      },
      {
        labelKey: 'SIDEBAR.USER_MANAGEMENT.CREATE',
        route: '/users/create',
        icon: 'person_add'
      },
      {
        labelKey: 'SIDEBAR.USER_MANAGEMENT.ROLES',
        route: '/users/roles',
        icon: 'security'
      }
    ]
  },
  {
    labelKey: 'SIDEBAR.SETTINGS.TITLE',
    icon: 'settings',
    menuKey: 'settings',
    children: [
      {
        labelKey: 'SIDEBAR.SETTINGS.PROFILE',
        route: '/settings/profile',
        icon: 'account_circle'
      },
      {
        labelKey: 'SIDEBAR.SETTINGS.NOTIFICATIONS',
        route: '/settings/notifications',
        icon: 'notifications'
      },
      {
        labelKey: 'SIDEBAR.SETTINGS.SYSTEM',
        route: '/settings/system',
        icon: 'tune',
        requiredRole: 'Admin',
        requiredPermission: 'settings:manage'
      },
      {
        labelKey: 'SIDEBAR.SETTINGS.SECURITY',
        route: '/settings/security',
        icon: 'lock',
        requiredRole: 'Admin',
        requiredPermission: 'security:manage'
      }
    ]
  }
];
