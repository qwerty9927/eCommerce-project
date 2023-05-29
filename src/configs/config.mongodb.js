
const develop = {
  app: {
    port: process.env.DEV_APP_PORT
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME
  }
}

const product = {
  app: {
    port: process.env.PRO_APP_PORT
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME
  }
}

const config = { develop, product }
const env = process.env.NODE_ENV || "develop"
module.exports = config[env]