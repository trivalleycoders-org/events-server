import express from 'express'
import { has, omit, merge } from 'ramda'
import fetch from 'node-fetch'
/* User */
import Event from '../models/event'
import PostalCode from '../models/postalCode'
import { isValidObjectID, objectIdFromHexString } from '../db/utils'
require('dotenv').config()

/* Dev */
import { red, yellow } from '../logger'

import { find, insert } from '../db'


const router = express.Router()
const hasTagsField = has('tags')



router.post('/', async (req, res) => {
  try {

    const event = req.body
    const postalCode_id = event.postalCode._id
    const _id = objectIdFromHexString(postalCode_id)
    const postalData = await find(
      'postalCodes',
      { _id: _id},
      { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
    )
    // Remove existing postCode and and merge
    const a = omit(['postalCode'], event)
    const b = merge(a, postalData[0])

    const inserted = await insert(
      'events',
      b
    )
    // res.send(JSON.stringify({ result: inserted.ops[0]}))
    // yellow('post', { result: [b], meta: {}})
    res.send({ result: [b], meta: {}})
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const events = await find('events', {})
    res.send({ result: events })
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
    res.send({ result: event })

  } catch (e) {
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
    res.send(JSON.stringify( { result: event }))
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    // yellow('patch: id', id)
    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    const eventSent = req.body
    // yellow('patch: body', eventSent)
    const eventToReturn = await Event.findByIdAndUpdate(
      id,
      { $set: eventSent },
      { new: true }
    )
    // yellow('patch: returned event', eventToReturn)
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send(JSON.stringify({ result: eventToReturn }))
  } catch (e) {
    red('catch', e)
    res.status(400).send()
  }

})


export default router
