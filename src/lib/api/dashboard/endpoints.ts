export const DASHBOARD_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    refresh: '/api/auth/refresh',
  },
  session: {
    heartbeat: '/api/employee/heartbeat',
    mySession: '/api/employee/my-session',
  },
  dashboard: {
    summary: '/api/dashboard/summary',
  },
  transactions: {
    teamAchievement: '/api/transactions/team-achievement',
  },
  notifications: {
    list: '/api/notifications',
    unreadCount: '/api/notifications/unread-count',
    markRead: (id: string) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all',
    delete: (id: string) => `/api/notifications/${id}`,
    clearRead: '/api/notifications/clear-all',
  },
  search: '/api/search',
  alerts: '/api/alerts',
  alertsSummary: '/api/alerts/summary',
  profile: {
    me: '/api/users/me',
    update: '/api/users/me',
    changePassword: '/api/users/me/password',
  },
  owners: {
    list: '/api/owners',
    select: '/api/owners/select',
    create: '/api/owners',
    byId: (id: string) => `/api/owners/${id}`,
    delete: (id: string) => `/api/owners/${id}`,
    projects: (id: string) => `/api/owners/${id}/projects`,
  },
  projects: {
    list: '/api/projects',
    select: '/api/projects/select',
    create: '/api/projects',
    byId: (id: string) => `/api/projects/${id}`,
    delete: (id: string) => `/api/projects/${id}`,
  },
  units: {
    list: '/api/units',
    create: '/api/units',
    byId: (id: string) => `/api/units/${id}`,
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    paginated: (page: number, pageSize: number) =>
      `/api/bookings?page=${page}&page_size=${pageSize}`,
  },
  users: {
    list: '/api/users',
    create: '/api/users',
    rolesAssignable: '/api/users/roles/assignable',
    byId: (id: string) => `/api/users/${id}`,
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string, permanent?: boolean) =>
      `/api/users/${id}?permanent=${Boolean(permanent)}`,
    toggleActive: (id: string) => `/api/users/${id}/toggle-active`,
  },
  customers: {
    list: '/api/customers',
    create: '/api/customers',
    stats: '/api/customers/stats',
    incomplete: '/api/customers/incomplete',
    byId: (id: string) => `/api/customers/${id}`,
    byPhone: (phone: string) => `/api/customers/phone/${phone}`,
    update: (id: string) => `/api/customers/${id}`,
    ban: (id: string) => `/api/customers/${id}/ban`,
    delete: (id: string) => `/api/customers/${id}`,
    bookings: (id: string) => `/api/customers/${id}/bookings`,
  },
  requests: {
    list: '/api/requests',
    create: '/api/requests',
    stats: '/api/requests/stats',
    updateStatus: (id: string) => `/api/requests/${id}/status`,
  },
  employeePerformance: {
    employeesStatus: '/api/employee-performance/employees-status',
  },
  integrations: {
    connections: '/api/integrations/connections',
    deleteConnection: (id: string) => `/api/integrations/connections/${id}`,
    syncConnection: (id: string) => `/api/integrations/connections/${id}/sync`,
    mappings: '/api/integrations/mappings',
    deleteMapping: (id: string) => `/api/integrations/mappings/${id}`,
    alerts: '/api/integrations/alerts',
    acknowledgeAlert: (id: string) => `/api/integrations/alerts/${id}/acknowledge`,
    resolveAlert: (id: string) => `/api/integrations/alerts/${id}/resolve`,
  },
  channex: {
    properties: '/api/channex/properties',
    roomTypes: (connectionId: string) => `/api/channex/connections/${connectionId}/room-types`,
    ratePlans: (connectionId: string, roomTypeId: string) =>
      `/api/channex/connections/${connectionId}/room-types/${roomTypeId}/rate-plans`,
  },
} as const;
