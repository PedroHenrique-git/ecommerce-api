export default () => ({
  pagination: {
    skip: 0,
    take: 10,
    page: 1,
  },

  general: {
    errorMessage: 'An error occurred during the operation',
  },

  infra: {
    host:
      process.env.NODE_ENV === 'development'
        ? process.env.HOST_DEV
        : process.env.HOST_PROD,
    hostTest: 'http://localhost:3000',
    port: process.env.PORT,
    isProduction: process.env.NODE_ENV === 'production',
  },

  security: {
    salts: 10,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpireTime: '1d',
    jwtCookieNameClient: 'client.session',
    jwtCookieNameAdmin: 'admin.session',
  },

  google: {
    clientId: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    redirectUrl:
      process.env.NODE_ENV === 'development'
        ? `${process.env.HOST_DEV}/auth/google/callback`
        : `${process.env.HOST_PROD}/auth/google/callback`,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },

  client: {
    url: process.env.CLIENT_URL,
  },
});
