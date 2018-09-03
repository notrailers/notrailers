require('dotenv').config()

module.exports = {
  development: {
    debug: true,
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST_DEVELOPMENT,
      database: process.env.DATABASE_NAME_DEVELOPMENT,
      user: process.env.DATABASE_USER_DEVELOPMENT,
      password: process.env.DATABASE_PASSWORD_DEVELOPMENT,
    },
    migrations: {
      directory: './database/migrations/',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST_DEVELOPMENT,
      database: process.env.DATABASE_NAME_DEVELOPMENT,
      user: process.env.DATABASE_USER_DEVELOPMENT,
      password: process.env.DATABASE_PASSWORD_DEVELOPMENT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './database/migrations/',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST_PRODUCTION,
      database: process.env.DATABASE_NAME_PRODUCTION,
      user: process.env.DATABASE_USER_PRODUCTION,
      password: process.env.DATABASE_PASSWORD_PRODUCTION,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './database/migrations/',
    },
    useNullAsDefault: true,
  },
}
