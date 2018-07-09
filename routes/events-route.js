import express from 'express'
import Event from '../models/event'
import { isValidObjectID, object_idFromHex } from '../db/utils'
import { omit } from 'ramda'
import { red, yellow } from '../logger'

const router = express.Router()

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
  yellow('*********** POST')
  try {
    const event = req.body
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
    const _id = object_idFromHex(id)
    let event = await Event.findByIdAndRemove(_id)
    if (!event) {
      return res.status(404).send()
    }
    res.send({event})
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {
  yellow('*********** PATCH')
  try {
    yellow('req.body', req.body)
    const id = req.params.id
    yellow('patch: id', id)
    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    // const eventToSend = omit(['_id'], req.body.event)
    const eventToSend = req.body
    yellow('patch: eventToSend', eventToSend)
    const eventToReturn = await Event.findByIdAndUpdate(id, { $set: eventToSend }, { new: true })
    yellow('patch: returned event', eventToReturn)
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send(eventToReturn)
  } catch (e) {
    res.status(400).send()
  }

})


export default router
