import express from 'express'
import { has } from 'ramda'
import fetch from 'node-fetch'
/* User */
import Event from '../models/event'
import PostalCode from '../models/postalCode'
import { isValidObjectID, objectIdFromHexString } from '../db/utils'

/* Dev */
import { red, yellow } from '../logger'

const MongoClient = require('mongodb').MongoClient
const database = 'EventsDev'
// const collection = 'postalCodes'
const url = 'mongodb://localhost:27017'

const router = express.Router()
const hasTagsField = has('tags')

router.get('/', async (req, res) => {
  try {
    let events = await Event.find()
    res.send({events})
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let event = await Event.findById(id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/', async (req, res) => {
  yellow('** events-route.post')

  try {
    const event = req.body
    yellow('event', event)
    // get postalCode data
    const postalCode_id = event.postalCode._id
    yellow('postalCode_id', postalCode_id)
    const _id = objectIdFromHexString(postalCode_id)

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    const db = await client.db(database)
    const postalData = await db.collection('postalCodes').find({ _id, }).toArray()

    yellow('postalData', postalData)
    // yellow('post: event', event)
    let ne = new Event(event)
    const eventAdded = await ne.save()
    // yellow('eventAdded', eventAdded)
    res.send(eventAdded)
  } catch (e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let event = await Event.findByIdAndRemove(id)
    if (!event) {
      return res.status(404).send()
    }
    res.send({event})
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    yellow('patch: id', id)
    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    const eventSent = req.body
    yellow('patch: body', eventSent)
    const eventToReturn = await Event.findByIdAndUpdate(
      id,
      { $set: eventSent },
      { new: true }
    )
    yellow('patch: returned event', eventToReturn)
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send(eventToReturn)
  } catch (e) {
    red('catch', e)
    res.status(400).send()
  }

})


export default router
