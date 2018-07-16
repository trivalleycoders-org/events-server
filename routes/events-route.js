import express from 'express'
import Event from '../models/event'
import { isValidObjectID } from '../db/utils'
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
  try {
    const event = req.body
    yellow('post: event', event)
    let ne = new Event(event)
    const eventAdded = await ne.save()
    yellow('eventAdded', eventAdded)
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
    const eventToReturn = await Event.findByIdAndUpdate(id, { $set: eventSent }, { new: true })
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
