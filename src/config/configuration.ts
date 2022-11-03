export default () => ({
  environment: process.env.ENVIRONMENT,
  port: parseInt(process.env.PORT, 10),
  database: {
    mssql: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
    },
  },
  pubsub: {
    credencial: process.env.GCLOUD_CREDENTIALS_SUBSCRIPTION_B64,
    id: process.env.GCLOUD_PROJECT_ID_SUBSCRIPTION,
    name: process.env.GCLOUD_SUBSCRIPTION_NAME,
    pullLimit: process.env.GCLOUD_SUBSCRIPTION_PULL_LIMIT,
  },
  api: {
    tasks: {
      endpoint: process.env.API_TASKS_ENDPOINT,
    },
  },
  jwt: {
    issuer: process.env.JWT_ISSUER,
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
  },
  cache: {
    ttl: process.env.CACHE_TTL,
  },
});
