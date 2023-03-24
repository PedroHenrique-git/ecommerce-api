// pagination
export const DEFAULT_SKIP = 0;
export const DEFAULT_TAKE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT = 'asc';

// infra
export const PORT = process.env.PORT ?? 3000;
export const GLOBAL_PREFIX = '/v1/api';
export const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

// security
export const NUMBER_OF_SALTS = 10;
export const JWT_EXPIRE_TIME = '60s';
