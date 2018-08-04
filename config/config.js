import { greenf, yellow } from '../logger'
require('dotenv').config()

const port = 3030
const env = process.env.NODE_ENV

let dbName
let dbUri

if (env === 'test') {
  dbName = process.env.TEST_DB
  dbUri = process.env.MONGODB_URI_TEST
} else if (env === 'development') {
  dbName = process.env.DEV_DB
  dbUri = process.env.MONGODB_URI_DEV
} else {
  // production
  dbName = 'TBD'
  dbUri = 'TBD'
}

process.env.PORT = 3030

// yellow('database', dbName)



// if (!env) {
//   process.env.NODE_ENV = 'development'

// }

// yellow('URI', process.env.MONGODB_URI_TEST)

// if(env === 'development') {
//   greenf('environment = ', process.env.NODE_ENV)
//   process.env.PORT = 3030
//   process.env.MONGODB_URI = process.env.MONGODB_URI_DEV
//   process.env.DATABASE = process.env.DEV_DB
// } else if(env === 'test') {
//   greenf('environment = ', process.env.NODE_ENV)
//   process.env.PORT = 3030
//   process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
//   process.env.DATABASE = process.env.TEST_DB
// } else if(env === 'production') {
//   greenf('environment = ', process.env.NODE_ENV)
//   process.env.DATABASE = process.env.PROD_DB
// } else {
//   redf('server.index.js: unknown NODE_ENV')
// }
