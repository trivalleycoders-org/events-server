import 'babel-polyfill'
import request from 'supertest'
import { expect } from 'chai'
import {ObjectID} from 'mongodb'
import app from '../../server/server'
import {yellow, blue, green, red, greenf, redf} from '../../logger/'
import { findOneAndUpdate, dropCollection, find, insertOne } from '../../db'
// import { fiveEvents } from './fixtures/fiveEvents'
import { newEventData , addedEvent } from './fixtures/oneEvent'
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

describe('event tests', async () => {
  describe('POST /events', async () => {
    before(async () => {
        await dropCollection('events')
    })
    it('add 1 event', async () => {
      const res = await request(app).post('/events').send(newEventData)
      expect(200)
      expect(res.body.data.length).to.equal(1)
      const result = res.body.data[0]
      const newEvent = omit(['_id'], result)
      expect(addedEvent).to.deep.equal(newEvent)
    })

  })


  /*
      add an event
      send an update
      check for update in returned event
  */
  describe('PATCH /events', async () => {
    let eventBefore
    let eventBefore_id
    let eventAfter
    before(async () => {
      await dropCollection('events')
      const ret = await insertOne('events', addedEvent)
      eventBefore = ret.data[0]
      eventBefore_id = addedEvent._id
      eventAfter = clone(eventBefore)
      // change organization from BRIIA to 'new org'
      eventAfter.organization = 'new org'

    })
    it('dummy',  async () => {
      expect(eventBefore.organization).to.equal('BRIIA')
      const ret = await request(app).patch(`/events/${eventBefore_id}`).send(eventAfter)
      // yellow('ret', ret)

      expect(200)

    })

  })

})
