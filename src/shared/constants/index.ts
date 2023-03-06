export const DEFAULT_SKIP = 0;
export const DEFAULT_TAKE = 10;
export const DEFAULT_PAGE = 1;

export const DEFAULT_ERROR_MESSAGE = 'An error occurred during the operation';

export const PORT = process.env.PORT;

export const HOST_TEST = 'http://localhost:3000';

export const HOST =
  process.env.NODE_ENV === 'development'
    ? process.env.HOST_DEV
    : process.env.HOST_PROD;
