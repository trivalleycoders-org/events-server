import 'babel-polyfill'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../../server/server'
import {yellow, blue, green, red, greenf, redf} from '../../../logger/'
import { findOneAndUpdate, dropCollection, find, insertOne } from '../../../db'
import { eventToPost, eventAfter } from './fixture'
import { omit, clone } from 'ramda'

require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

after(async () => {
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})

describe('POST /events', async () => {
  before(async () => {
      await dropCollection('events')
  })
  it('add 1 event', async () => {
    const res = await request(app).post('/events').send(eventToPost)
    // yellow('res', res.body)
    expect(200)
    const data = res.body.data
    expect(data.length).to.equal(1)
    // yellow('data', data)
    const returnedEvent = data[0]
    // yellow('returnedEvent', returnedEvent)
    // remove _id so can compare
    const eventToCompare = omit(['_id'], returnedEvent)
    expect(eventAfter).to.deep.equal(eventToCompare)
  })

})



