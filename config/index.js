import { greenf, yellow } from '../logger'
require('dotenv').config()

const env = process.env.NODE_ENV

if (!env) {
  process.env.NODE_ENV = 'development'

}

if(process.env.NODE_ENV === 'development') {
  greenf('environment = ', process.env.NODE_ENV)
  process.env.PORT = 3001
  process.env.MONGODB_URI = process.env.MONGOD_URI_DEV
} else if(process.env.NODE_ENV === 'test') {
  greenf('environment = ', process.env.NODE_ENV)
  process.env.PORT = 3001
  process.env.MONGODB_URI = process.env.MONGOD_URI_TEST
} else if(process.env.NODE_ENV === 'production') {
  greenf('environment = ', process.env.NODE_ENV)
} else {
  redf('server.index.js: unknown NODE_ENV')
}
