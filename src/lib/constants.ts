export const APP_NAME = 'مدیریت اموال';
export const APP_VERSION = '1.0.0';

export const QUERY_KEYS = {
  ASSETS: 'assets',
  ASSET_DETAIL: 'asset-detail',
  TRANSFER_HISTORY: 'transfer-history',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ASSETS: '/assets',
  ASSET_NEW: '/assets/new',
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  ASSET_EDIT: (id: string) => `/assets/${id}/edit`,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const VALIDATION = {
  MAX_ASSET_NAME_LENGTH: 100,
  MAX_ASSET_NUMBER_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_NAME_LENGTH: 3,
} as const;
