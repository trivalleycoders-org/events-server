import 'babel-polyfill'
import request from 'supertest'
import {expect} from 'chai'
import {ObjectID} from 'mongodb'
import app from '../server/server'
import {yellow, blue, green, red, greenf, redf} from '../logger/'
// import { fiveEvents } from './fixtures/fiveEvents'
import { oneNewEvent } from './fixtures/oneNewEvent'
require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const MongoClient = require('mongodb').MongoClient
const database = 'EventsTest'
const collection = 'events'
const url = process.env.MONGODB_URI

after(async () => {
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})


describe('event tests', async () => {
  yellow('database', database)
  let db
  try {
    greenf('connecting ...')
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    db = await client.db(database)
  }
  catch (e) {
    redf('ERROR connecting', e)
  }

  describe('POST /events', async () => {
    before(async () => {
      try {
        await db.collection('events').drop()
      }
      catch (e) {
        redf('unknown error dropping collection')
      }
    })
    const res = await request(app).post('/events').send(oneNewEvent)
    expect(200)
    yellow('res.body', res.body)
  })

})


// old
// describe('POST /events', async () => {
//   yellow('two')
//   describe('should insert 5 members', async () => {
//     const ret = await db.collection('events').insertMany(fiveEvents)
//     // const ret = db.collection('events').insertMany(fiveEvents)
//     // yellow('ret', ret.result)
//     // drop the existing collection
//     const drop = await db.collection('events').drop()
//     if (!drop) {
//       redf('unknown error dropping collection')
//     }

//   })
// })