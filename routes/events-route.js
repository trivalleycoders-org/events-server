import express from 'express'
import { omit, merge } from 'ramda'
/* User */
import { find, findById, insertOne, findOneAndDelete, findOneAndUpdate } from '../db'
/* Dev */
import { red, yellow } from '../logger'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const event = req.body
    const postalCode_id = event.postalCode._id
    const postalData = await find(
      'postalCodes',
      postalCode_id,
      { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
    )
    // Remove existing postCode and and merge
    const a = omit(['postalCode'], event)
    const b = merge(a, postalData[0])
    const inserted = await insertOne(
      'events',
      b
    )
    red("what's returned: inserted", inserted)
    res.send({ data: [b], meta: {}})
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const events = await find('events', {})
    res.send({ data: events, meta: {} })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    let event = await findById('events', id)
    if (!event) {
      return res.status(404).send()
    }
    res.send({ data: event, meta: {} })

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
    res.send({ data: event, meta: {} })
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    const eventSent = req.body
    const eventToReturn = await findOneAndUpdate(
      'events',
      {_id: id},
      { $set: eventSent },
    )
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send({ data: eventToReturn, meta: {} })
  } catch (e) {
    red('catch', e)
    res.status(400).send()
  }

})

export default router
