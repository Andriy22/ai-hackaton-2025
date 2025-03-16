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

export type AppPaths = typeof paths;
