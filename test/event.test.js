import 'babel-polyfill'
import request from 'supertest'
import { expect } from 'chai'
import {ObjectID} from 'mongodb'
import app from '../server/server'
import {yellow, blue, green, red, greenf, redf} from '../logger/'
import { dropCollection, find, insert } from '../db'
// import { fiveEvents } from './fixtures/fiveEvents'
import { newEventData , addedEvent } from './fixtures/oneEvent'
import { omit } from 'ramda'

require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const MongoClient = require('mongodb').MongoClient
const database = process.env.DATABASE
const collection = 'events'
const uri = process.env.MONGODB_URI

after(async () => {
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})


describe('event tests', async () => {
  // describe('POST /events', async () => {
  //   before(async () => {
  //       await dropCollection('events')
  //   })
  //   it('add 1 event', async () => {
  //     const res = await request(app).post('/events').send(newEventData)
  //     expect(200)
  //     expect(res.body.result.length).to.equal(1)
  //     const result = res.body.result[0]
  //     const newEvent = omit(['_id'], result)
  //     expect(addedEvent).to.deep.equal(newEvent)
  //   })

  // })

  describe('PATCH /events', async () => {
    before(async () => {
      await dropCollection('events')
      const ret = await insert('events', addedEvent)
      yellow('ret', ret.data[0])
    })
    it('dummy',  async () => {
      expect(1).to.equal(1)
    })

  })

})
