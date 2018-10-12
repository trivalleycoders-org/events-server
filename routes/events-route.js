import express from 'express'
import { omit, merge } from 'ramda'
/* User */
import { find, findById, findByDate, findByTitle, insertOne, findOneAndDelete, findOneAndUpdate, objectIdFromHexString } from '../db'
/* Dev */
import { red, yellow } from '../logger'

const router = express.Router()

router.post('/', async (req, res) => {

  try {
    const event = req.body
    const inserted = await insertOne(
      'events',
      event
    )
    res.send(inserted)
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const d = new Date()
    const yr = d.getFullYear()
    const mo = d.getMonth()
    const day = d.getDay()
    const today = new Date(yr, mo, day)
    const events = await find('events', { 'dates.startDateTime': { $gt: today.toISOString() }})
    // const events = await find('events', { })
    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/user/:userId', async (req, res) => {

  try {
    const events = await find('events', {userId: req.params.userId})
    // const events = await find('events', {})

    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/user/:userId/date', async (req, res) => {
  try {
    const events = await findByDate('events', {userId: req.params.userId})
    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

// router.get('/user/:userId/location', async (req, res) => {
//   try {

//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

router.get('/user/:userId/title', async (req, res) => {
  try {
    const events = await findByTitle('events', {userId: req.params.userId})
    res.send(events)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  // yellow('get/id')
  const id = req.params.id
  try {
    let event = await findById('events', id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)

  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  try {
    let event = await findOneAndDelete('events', id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    const eventSent = req.body
    const postalCodeId = objectIdFromHexString(eventSent.postalCodeId)
    const postalData = await findById(
      'postalCodes',
      postalCodeId,
      { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
    )
    // yellow('postalCodeId', postalCodeId)
    // yellow('postalData', postalData)
    const a = omit(['postalCode_id'], eventSent)
    const b = merge(a, postalData.data[0])
    const eventToReturn = await findOneAndUpdate(
      'events',
      id,
      b,
    )
    // yellow('eventToReturn: ', eventToReturn)
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
