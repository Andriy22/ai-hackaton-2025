export const paths = {
  home: '/',
  landing: '/landing',
  auth: {
    login: '/auth/login'
  },
  dashboard: '/dashboard',
  users: {
    root: '/dashboard/users',
    details: (id = ':userId') => `/dashboard/users/${id}`,
    edit: (id = ':userId') => `/dashboard/users/${id}/edit`,
  },
  organizations: {
    root: '/dashboard/organizations',
    details: (id = ':organizationId') => `/dashboard/organizations/${id}`,
    edit: (id = ':organizationId') => `/dashboard/organizations/${id}/edit`,
  },
  employees: {
    details: (id = ':employeeId') => `/dashboard/employees/${id}`,
  },
  validation: '/validation',
  account: '/account'
} as const;

export const validatorAllowedPaths = [
  paths.validation,
  paths.account
];

export const adminAllowedPaths = [
  paths.dashboard,
  paths.account,
  paths.employees.details(),
  paths.organizations.details()
];

export const superAdminAllowedPaths = [
  paths.dashboard,
  paths.users.root,
  paths.users.details(),
  paths.organizations.root,
  paths.organizations.details(),
  paths.employees.details(),
  paths.validation,
  paths.account
];

export type AppPaths = typeof paths;
